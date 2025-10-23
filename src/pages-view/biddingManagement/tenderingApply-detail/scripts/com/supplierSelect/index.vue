<template>
    <div>

        <sub-title title="参与供应商">
            <template #beforeIcon>
                <i :class=" formDataShow.gys ? 'el-icon-caret-bottom' : 'el-icon-caret-right' " @click="formDataShow.gys = !formDataShow.gys"></i>
            </template>
            <template #buttons >
              <page-button @click="addSupplierVisible=true" :disabled="!(editState)"  >添加供应商</page-button>
            </template>
        </sub-title>
        <div v-show="formDataShow.gys">
            <div class="change-btn">   
                <el-button :type="formDataShow.gysbg ? 'primary' : 'default'"  @click="formDataShow.gysbg = true;formDataShow.gyskp = false" >表格视图</el-button>
                <el-button :type="formDataShow.gyskp ? 'primary' : 'default'"  @click="formDataShow.gyskp = true;formDataShow.gysbg = false" >卡片视图</el-button>
            </div>
            <vxe-toolbar ref="toolbar" class="app-table-toolbar" v-show="formDataShow.gysbg" >
                <template #tools>
                    <combine-operation
                        style="margin-left: 12px"
                        :options="combineOptions"
                        :source-list="descSourceList"
                        button-text="批量填充"
                        :disabled="!editState"
                        @click="onCombineOptionsOk"
                    ></combine-operation>
                <table-tools
                    :default-columns="defaultColumns"
                    @ok="onToolOk"
                ></table-tools>
                </template>
            </vxe-toolbar>
        
            <vxe-grid
                v-show="formDataShow.gysbg"
                :data="localForm.supplierList"
                :id="`tb_cgsq_supplier_${userInfo.userId}`"
                :custom-config="{ storage: true }"
                :columns="columns"
                ref="table"
                @cell-dblclick="onCellDbClick"
                min-height="180"
                max-height="600"
                >
                <template #suggestedFlag="{ row }">
                    <div v-if="editState">
                        <el-select v-model="row.suggestedFlag" >
                            <el-option v-for="item in descSourceList.suggestedFlag" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </div>
                    <div v-else>
                        <span v-if="row.suggestedFlag == '1'" style="color: #409EFF;cursor: pointer;"> 是</span>
                        <span v-else>{{ row.suggestedFlag==0 ? '否' : '' }}</span>
                    </div>
                </template>
                <template #bidFlag="{ row }">
                    <span v-if="row.bidFlag == '1'" style="color: #409EFF;cursor: pointer;" @click="onHoverClick(row)"> 已投标</span>
                    <span v-else>未投标</span>
                </template>
                <template #registrationStatusName="{ row }">
                    <span  style="color: #409EFF;cursor: pointer;">{{ row.registrationStatusName }}</span>
                </template>
                <template #suggestedRemark="{ row }">
                    <div v-if="editState">
                        <el-input v-model="row.suggestedRemark" type="textarea" :rows="2" placeholder="请输入推荐理由" ></el-input>
                    </div>
                    <div v-else>
                        <span>{{ row.suggestedRemark }}</span>
                    </div>
                </template>
            </vxe-grid>
            <div v-show="formDataShow.gyskp" class="gyskp-box">
                <div class="gyskp-item"  v-for="item in localForm.supplierList" :key="item.id" @dblclick="onCellDbClick({row:item})" :class="{'Ac': item.bidFlag == '1' }">
                    <div class="gyskp-item-title">
                        <img v-if="item.supplierLogoFile" :src="item.supplierLogoFile.url" alt="" style="width: 36px;height: 36px;border-radius: 50%;">
                        <span class="gyskp-item-title-left">{{ item.supplierName }}</span>
                        <span class="gyskp-item-title-right">
                            <span :class="item.registrationStatus == '0' ?'': 'AC' ">{{ item.registrationStatusName }}</span>
                        </span>
                    </div>
                    <div class="gyskp-item-content">
                        <div class="gyskp-item-info">
                            <p>
                                <i class="el-icon-user"></i>
                                <span> {{ item.linkerName }}</span>
                            </p>
                            <p>
                                <i class="el-icon-phone"></i>
                                <span>{{ item.linkerTel }}</span>
                            </p>
                            <p>
                                <i class="el-icon-message"></i>
                                <span>{{ item.linkerEmail }}</span>
                            </p>
                        </div>
                        <div class="proj-info">
                            <p>入围次数：<span>{{ item.entryCount }}</span></p>
                            <p>中标次数：<span>{{ item.winCount }}</span></p>
                        </div>
                        <div class="proj-info">
                            <p>投标状态：<span class="flag-text" :class="item.bidFlag == '0' ? 'flag-text' : 'AC'">{{ item.bidFlag == '0' ? '未投标' : '已投标' }}</span></p>
                            <p v-if="item.bidFlag == '1'">投标金额：<span>{{ item.amount }}</span></p>
                        </div>
                        <div class="proj-info flag-info">
                            <p>推荐入围：</p>
                            <p v-if="editState">
                                <el-select v-model="item.suggestedFlag" >
                                    <el-option v-for="item in descSourceList.suggestedFlag" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </p>
                            <p v-else>
                                <span v-if="item.suggestedFlag == '1'" style="color: #409EFF;cursor: pointer;"> 是</span>
                                <span v-else>{{ item.suggestedFlag==0 ? '否' : '' }}</span>
                            </p>
                        </div>
                    
                        <div class="proj-info flag-info">
                            <p>推荐理由：</p>
                            <p v-if="editState">
                                <el-input v-model="item.suggestedRemark" type="textarea" :rows="1" placeholder="请输入推荐理由" ></el-input>
                            </p>
                            <p v-else>
                                <span>{{ item.suggestedRemark }}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <vxe-modal
            width="80%"
            v-model="addSupplierVisible"
            resize
            title="添加供应商"
            destroy-on-close
            height="90%"
            @close="addSupplierVisible = false"
            class-name="add-modal"
        >
            <supplier-list
                menuCode="bidding_tenderingApply"
                @ok="addSupplierData"
                v-if="addSupplierVisible"
            ></supplier-list>
        </vxe-modal>
        <vxe-modal
            width="80%"
            v-model="lookQuotation"
            resize
            title="供应商报价明细"
            destroy-on-close
            height="90%"
            @close="lookQuotation = false"
            class-name="add-modal"
        >
            <quotation-details :form-data = form  :row-data = rowData></quotation-details>
        </vxe-modal>


    </div>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>
