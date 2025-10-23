<template>
    <div>
        <el-upload class="upload-demo"
            action="/api/file/notAuthFile/upload" :on-preview="handlePreview"
            :on-remove="handleRemove" :before-remove="beforeRemove" :on-change="handleChange"
            :headers="headers" :limit="limit" :multiple="limit!=1" :file-list="fileList"
            :on-exceed="handleExceed">
            <el-button size="small" type="primary">点击上传</el-button>
            <div style="margin-left:10px" slot="tip" class="el-upload__tip">请上传jpg、png图片附件，最多可上传4张，单张大小不要超过8M</div>
        </el-upload>
    </div>
</template>
<script>
export default {
    props: {
        files: { type:Array, default:[] },
        limit: { type:Number, default:4 }
    },
    data() {
        return {
            headers: {
                Authorization:this.$store.state.token
            },
            fileList:[]
        }
    },
    methods:{
        handleChange(files,fileList){
            this.fileList = fileList
            this.$emit('getFiles', fileList)
        },
        handleRemove(file, fileList) {
            this.fileList = fileList
            this.$emit('getFiles', fileList)
        },
        handlePreview(file) {},
        beforeRemove(file, fileList) {},
        handleExceed(files, fileList) {
            this.$message.warning('请上传不超过'+this.limit+'个文件')
        }
    },
    created(){
        this.fileList = this.files.length?this.files:[]
    }
}
</script>
