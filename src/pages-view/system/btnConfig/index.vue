<template>
  <app-page>
    <div class="app-body">
      <div class="view-section app-right tab-view-section">
        <!-- <header>审核员</header> -->
        <el-tabs v-model="activeTab" @tab-click="tabClick" flex>
          <el-tab-pane name="menu">
            <span slot="label">菜单按钮</span>
            <div class="tab-content-container detailed-container menu-content">
              <div class="menu-left">
                <el-input placeholder="搜索" v-model="filterText" clearable />
                <el-tree
                  :data="treeData"
                  default-expand-all
                  highlight-current
                  :indent="12"
                  ref="roleTree"
                  :filter-node-method="filterNode"
                  :expand-on-click-node="false"
                  :props="defaultProps"
                  @node-click="handleNodeClick"
                ></el-tree>
              </div>
              <div class="menu-right" v-if="sysMenuId">
                <sub-title> 
                  <template #title>
                    <h4>Menu Info <i class="el-icon-edit-outline" @click="editMenu"></i></h4>                    
                  </template>
                   </sub-title>
                <data-form
                  :items="descItems"
                  ref="dataForm"
                  :form-data="menuData"
                />
                <table-section ref="tableSection">
                  <div class="app-table-container">
                    <div
                      class="app-table-header"
                      style="
                        display: flex;
                        justify-content: space-between;
                        margin: 0;
                        margin-bottom: 10px;
                        padding-left: 0;
                      "
                    >
                      <sub-title title="Button List"> </sub-title>
                      <page-button
                        content="新增"
                        @click="addBtnClick"
                      ></page-button>
                    </div>
                    <div class="app-table-body">
                      <vxe-grid
                        :data="menuData.buttonDetails"
                        height="auto"
                        :columns="bindColumns"
                        ref="table"
                      >
                      <template #defaultView="{ row, rowIndex }">
                      <span>{{showdefaultView(row.defaultView)}}</span>
                    </template>
                        <template #cz="{ row, rowIndex }">
                          <div class="tableRowEdit">
                            <page-button
                              type="text"
                              @click="addBtnClick(false,row)
                              "
                            >
                              修改</page-button
                            >
                            <el-divider direction="vertical"></el-divider>
                            <page-button  type="text" theme="default"  @click="deleteClick(row)">
                              删除
                            </page-button>
                          </div>
                        </template>
                        <template #rowNum="{ row, rowIndex }">
                          {{ rowIndex + 1 }}
                        </template>
                        <!-- <template #btnName="{ row, rowIndex }">
                        {{row.buttonInfo.btnName}}
                      </template>
                      <template #btnCode="{ row, rowIndex }">
                        {{row.buttonInfo.btnCode}}</template>
                      <template #funName="{ row, rowIndex }">
                        {{row.buttonInfo.funName}}
                      </template> -->
                      
        </vxe-grid>
                    </div>
                  </div>
                </table-section>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane name="groovy">
            <span slot="label">Groovy配置</span>
            <div class="tab-content-container detailed-container">
              <table-section ref="tableSection">
                <div class="app-table-container">
                  <div
                    class="app-table-header"
                    style="
                      display: flex;
                      justify-content: space-between;
                      margin: 0;
                      margin-bottom: 10px;
                      padding-left: 0;
                    "
                  >
                    <sub-title title="Button List"> </sub-title>
                    <page-button
                        content="新增"
                        @click="addBtnClick"
                      ></page-button>
                  </div>
                  <div class="app-table-body">
                    <vxe-grid
                      :data="groovyData.records"
                      height="auto"
                      :columns="groovyColumns"
                      ref="table"
                    >
                  
                      <template #rowNum="{ row, rowIndex }">
                        {{ rowIndex + 1 }}
                      </template>
                      <template #cz="{ row, rowIndex }">
                        <div class="tableRowEdit">
                          <page-button
                              type="text"
                              @click="addBtnClick(false,row)
                              "
                            >
                              修改</page-button
                            >
                          <el-divider direction="vertical"></el-divider>
                          <page-button type="text" theme="default"  @click="deleteClick(row)">
                              删除
                            </page-button>
                        </div>
                      </template>
                    
        </vxe-grid>
                  </div>
                </div>
              </table-section>
            </div>
          </el-tab-pane>
          <el-tab-pane name="sql">
            <span slot="label">SQL配置</span>
            <div class="tab-content-container detailed-container">
              <table-section ref="tableSection">
                <div class="app-table-container">
                  <div
                    class="app-table-header"
                    style="
                      display: flex;
                      justify-content: space-between;
                      margin: 0;
                      margin-bottom: 10px;
                      padding-left: 0;
                    "
                  >
                    <sub-title title="Button List"> </sub-title>
                    <page-button
                        content="新增"
                        @click="addBtnClick"
                      ></page-button>
                  </div>
                  <div class="app-table-body">
                    <vxe-grid
                      :data="sqlData.records"
                      height="auto"
                      :columns="sqlColumns"
                      ref="table"
                    >
                      <template #rowNum="{ row, rowIndex }">
                        {{ rowIndex + 1 }}
                      </template>
                      <template #cz="{ row, rowIndex }">
                        <div class="tableRowEdit">
                          <page-button
                              type="text"
                              @click="addBtnClick(false,row)
                              "
                            >
                              修改</page-button
                            >
                          <el-divider direction="vertical"></el-divider>
                          <page-button type="text" theme="default"  @click="deleteClick(row)">
                              删除
                            </page-button>
                        </div>
                      </template>
                    
        </vxe-grid>
                  </div>
                </div>
              </table-section>
            </div>
          </el-tab-pane>
          <el-tab-pane name="rule">
            <span slot="label">显示逻辑</span>
            <div class="tab-content-container detailed-container">
              <table-section ref="tableSection">
                <div class="app-table-container">
                  <div
                    class="app-table-header"
                    style="
                      display: flex;
                      justify-content: space-between;
                      margin: 0;
                      margin-bottom: 10px;
                      padding-left: 0;
                    "
                  >
                    <sub-title title="Button List"> </sub-title>
                    <page-button
                        content="新增"
                        @click="addBtnClick"
                      ></page-button>
                  </div>
                  <div class="app-table-body">
                    <vxe-grid
                      :data="ruleDate.records"
                      height="auto"
                      :columns="ruleColumns"
                      ref="table"
                    >
                      <template #rowNum="{ row, rowIndex }">
                        {{ rowIndex + 1 }}
                      </template>
                      <template #cz="{ row, rowIndex }">
                        <div class="tableRowEdit">
                          <page-button
                              type="text"
                              @click="addBtnClick(false,row)
                              "
                            >
                              修改</page-button
                            >
                          <el-divider direction="vertical"></el-divider>
                          <page-button type="text" theme="default"  @click="deleteClick(row)">
                              删除
                            </page-button>
                        </div>
                      </template>
                    
        </vxe-grid>
                  </div>
                </div>
              </table-section>
            </div>
          </el-tab-pane>
          <el-tab-pane name="dynamic">
            <span slot="label">动态字段</span>
            <div class="tab-content-container detailed-container">
              <table-section ref="tableSection">
                <div class="app-table-container">
                  <div
                    class="app-table-header"
                    style="
                      display: flex;
                      justify-content: space-between;
                      margin: 0;
                      margin-bottom: 10px;
                      padding-left: 0;
                    "
                  >
                    <sub-title title="Button List"> </sub-title>
                    <page-button
                        content="新增"
                        @click="addBtnClick"
                      ></page-button>
                  </div>
                  <div class="app-table-body">
                    <vxe-grid
                      :data="dynamicData.records"
                      height="auto"
                      :columns="trendsColumns"
                      ref="table"
                    >
                      <template #rowNum="{ row, rowIndex }">
                        {{ rowIndex + 1 }}
                      </template>
                      <template #columnConfig="{ row, rowIndex }">
                        {{ row.columnConfig}}
                      </template>
                      <template #cz="{ row, rowIndex }">
                        <div class="tableRowEdit">
                            <page-button
                              type="text"
                              @click="addBtnClick(false,row)
                              "
                            >
                              修改</page-button
                            >
                          <el-divider direction="vertical"></el-divider>
                          <page-button type="text" theme="default"  @click="deleteClick(row)">
                              删除
                            </page-button>
                        </div>
                      </template>
                    
        </vxe-grid>
                  </div>
                </div>
              </table-section>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!--新增修改表格信息 -->
    <popup-form
      v-model="menuFormVisible"
      :title="showTitle"
      :form-data="addMenuObj"
      :data-gather="addGather"
      :data-list="descSourceList"
      :rules="addRules"
      @ok="addOk"
    >
    </popup-form>
    <!-- 修改菜单按钮表头 -->
    <popup-form
      v-model="editMenuFormVisible"
      title="修改"
      :form-data="ditMenuFormObj"
      :data-gather="ditMenuFormGather"
      :rules="ditMenuFormRules"
      :data-list="descSourceList"
      @ok="editMenuFormOk"
    >
    </popup-form>

  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>
