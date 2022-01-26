<template>
  <div class="tab-container">
    <div class="filter-container">
      <el-input v-model="listQuery.keyword" placeholder="关键字查询" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-folder-add">上传血清压缩包</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-folder-add">上传血浆压缩包</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-document" @click="handleGenerate">
        生成数据
      </el-button>
      <el-button class="filter-item" :loading="downloadLoading" type="primary" icon="el-icon-document" @click="handleDownload">
        导出表格
      </el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="handleEmptyData">
        清空数据
      </el-button>
      <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增记录
      </el-button>
    </div>
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      :data="tableData"
      style="width: 100%"
      border>
      <el-table-column
      type="selection"
      align="center"
      width="40">
      </el-table-column>
      <el-table-column
        fixed
        prop="name"
        label="姓名"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="age"
        label="年龄"
        align="center"
        width="60">
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别"
        align="center"
        width="60">
      </el-table-column>
      <el-table-column
        prop="patientNumber"
        label="病人编号"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="result"
        label="临床诊断"
        align="center"
        min-width="200">
      </el-table-column>
      <el-table-column
        prop="serumSampleNumber"
        label="血清样本号"
        align="center"
        width="120">
      </el-table-column>
      <el-table-column
        prop="serumTime"
        label="血清采样时间"
        align="center"
        width="130">
      </el-table-column>
      <el-table-column
        prop="plasmaSampleNumber"
        align="center"
        label="血浆样本号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="plasmaTime"
        label="血浆采样时间"
        align="center"
        width="130">
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.current" :limit.sync="listQuery.size" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :inline="true" class="demo-form-inline" ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="margin-left:20px;">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="temp.age" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="temp.sex" class="filter-item" placeholder="请选择" style="width:176px">
            <el-option v-for="item in sexOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="病人编号" prop="patientNumber">
          <el-input v-model="temp.patientNumber" />
        </el-form-item>
        <el-form-item label="临床诊断" prop="result" style="display: block">
          <el-input v-model="temp.result" style="width:297%"/>
        </el-form-item>
        <el-form-item label="血清样本号" prop="serumSampleNumber">
          <el-input v-model="temp.serumSampleNumber" />
        </el-form-item>
        <el-form-item label="血清采样时间" prop="serumTime">
          <el-input v-model="temp.serumTime" />
        </el-form-item>
        <el-form-item label="血浆样本号" prop="plasmaSampleNumber">
          <el-input v-model="temp.plasmaSampleNumber" />
        </el-form-item>
        <el-form-item label="血浆采样时间" prop="plasmaTime">
          <el-input v-model="temp.plasmaTime" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, createGyRecord, updateGyRecord, deleteGyRecord, generateData, clearAll } from '@/api/gyadmin'
import Pagination from '@/components/Pagination'
import { parseTime } from '@/utils'

const sexOptions = ['男', '女']

export default {
  name: 'Tab',
  components: { Pagination },
  data() {
    return {
      loading: false,
      downloadLoading: false,
      tableData: null,
      total: 0,
      listQuery: {
        current: 1,
        size: 10,
        keyword: '',
        order: 'id',
        sort: 'desc'
      },
      list: null,
      sexOptions,
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rules: {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        age: [{ required: true, message: '年龄不能为空', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        patientNumber: [{ required: true, message: '病人编号不能为空', trigger: 'blur' }],
        result: [{ required: true, message: '诊断结果不能为空', trigger: 'blur' }],
        serumSampleNumber: [{ required: true, message: '血清样本编号不能为空', trigger: 'blur' }],
        serumTime: [{ required: true, message: '血清采样时间不能为空', trigger: 'blur' }],
        plasmaSampleNumber: [{ required: true, message: '血浆样本编号不能为空', trigger: 'blur' }],
        plasmaTime: [{ required: true, message: '血浆采样时间不能为空', trigger: 'blur' }]
      }
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    this.getList()
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
    getList() {
      this.loading = true
      fetchList(this.listQuery).then(response => {
        this.loading = false
        this.tableData = response.data.records
        this.total = response.data.page.total
      }).catch(() => {
        this.loading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {}
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createGyRecord(this.temp).then((res) => {
            this.tableData.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateGyRecord(tempData).then((res) => {
            const index = this.tableData.findIndex(v => v.id === this.temp.id)
            this.tableData.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: res.message,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new URLSearchParams()
        params.append('id', row.id)
        deleteGyRecord(params).then((res) => {
          this.tableData.splice(index, 1)
          this.$notify({
            title: '成功',
            message: res.message,
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    handleGenerate() {
      this.loading = true
      generateData().then((res) => {
        this.loading = false
        this.getList()
        this.$notify({
          title: '成功',
          message: res.message,
          type: 'success',
          duration: 2000
        })
      }).catch(() => {
        this.loading = false
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['姓名', '年龄', '性别', '病人编号', '临床诊断', '血清样本号', '血清采样时间', '血浆样本号', '血浆样本号']
        const filterVal = ['name', 'age', 'sex', 'patientNumber', 'result', 'serumSampleNumber', 'serumTime', 'plasmaSampleNumber', 'plasmaTime']
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '广医-' + Math.random().toString(36),
          autoWidth: this.autoWidth
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    handleEmptyData() {
      this.$confirm('此操作将清空所有记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        clearAll().then((res) => {
          this.tableData = []
          this.$notify({
            title: 'Success',
            message: res.message,
            type: 'success',
            duration: 2000
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
  .el-form-item {
    margin-left: 50px;
  }
</style>
