import XEUtils from 'xe-utils'
import { rowDown, rowUp } from '../table-utils'
import { ApiQuotation } from "@/apis"
const apiQuotation = new ApiQuotation();
function copyInsert(arr, rows) {
  const ls = [...arr];
  let count = 0;
  rows.forEach((i) => {
    const idx = i + count;

    let item = { ...ls[idx] };
    delete item.id;
    delete item._X_ROW_KEY;
    ls.splice(idx, 0, item);
    count++;
  });
  return ls;
}

export default {
  data() {
    return {
      toLine: null,
      tableActions: {
        copy: (table, selectedRows) => {
          const rows = selectedRows.map((row) => {
            return table.getRowIndex(row);
          });
          const list = copyInsert(this.form.detailList, rows);
          let count = 0;
          const indexlist = rows.map((i, idx) => {
            return i + ++count;
          });
         
          table.clearCheckboxRow();
          this.$nextTick(() => {
            table.setCheckboxRow(
              indexlist.map((i) => list[i]),
              true
            );
          });
          this.form.detailList = [...list]
          // this.reloadTableData(list)
        },
        reverse: (table, selectedRows) => {
          const list = [...this.form.detailList]
          const rows = selectedRows.map(row => {
            return table.getRowIndex(row)
          })
          list.forEach((item, index) => {
            let checked = rows.includes(index)
            table.setCheckboxRow(item, !checked)
          })
        },
        moveUp: (table, selectedRows) => {
          const rows = selectedRows.map(row => {
            return table.getRowIndex(row)
          }).sort((a, b) => a - b);
          const list = [...this.form.detailList]
          let frozen = []
          let newKeys = []
          rows.forEach((i) => {
            let idx = rowUp(list, i, frozen)
            newKeys.push(idx)
          })
          table.clearCheckboxRow()
          table.setCheckboxRow(newKeys.map(i => list[i]), true)
          this.form.detailList = list
        },
        moveDown: (table, selectedRows) => {
          const rows = selectedRows.map(row => {
            return table.getRowIndex(row)
          }).sort((a, b) => b - a)
          const list = [...this.form.detailList]
          let frozen = []
          let newKeys = []
          rows.forEach((i) => {
            let idx = rowDown(list, i, frozen)
            newKeys.push(idx)
          })
          table.clearCheckboxRow()
          table.setCheckboxRow(newKeys.map(i => list[i]), true)
          this.form.detailList = list
        },
        toTop: (table, selectedRows) => {
          const rows = selectedRows.map(row => {
            return table.getRowIndex(row)
          })
          const list = [...this.form.detailList]
          const arr1 = list.filter((i, idx) => rows.includes(idx))
          const arr2 = list.filter((i, idx) => !rows.includes(idx))
          const data = arr1.concat(arr2)
          table.clearCheckboxRow()
          table.setCheckboxRow(arr1.map((i, idx) => data[idx]), true)
          this.form.detailList = data
        },
        toBottom: (table, selectedRows) => {
          const rows = selectedRows.map(row => {
            return table.getRowIndex(row)
          })
          const list = [...this.form.detailList]
          const arr1 = list.filter((i, idx) => rows.includes(idx))
          const arr2 = list.filter((i, idx) => !rows.includes(idx))
          const data = arr2.concat(arr1)
          table.clearCheckboxRow()
          table.setCheckboxRow(arr1.map((i, idx) => data[data.length - arr1.length + idx]), true)
          this.form.detailList = data
        },
        delete: (table, selectedRows) => {
          const rows = selectedRows.map(row => {
            return table.getRowIndex(row)
          })
          // let ids = selectedRows.filter(x => !!x.id).map(mapx => {
          //   return mapx.id
          // })
          // if(ids.length > 0){
          //   apiQuotation.getAgreementDetailRemove(ids).then(res => {
          //     if(res.code === 200){
          //       const list = [...this.form.detailList]
          //       const data = list.filter((i, idx) => !rows.includes(idx))
          //       this.form.detailList = data;
          //       this.backForm.detailList = this.backForm.detailList.filter((x) => !ids.includes(x.id));
          //       this.$message.success("删除成功");
          //     }else{
          //       this.$message.warning('删除失败');
          //     }
          //   })
          // }else{
            const list = [...this.form.detailList]
            const data = list.filter((i, idx) => !rows.includes(idx))
            this.form.detailList = data;
            this.$message.success("删除成功");
          // } 
        },
        toLine: (table, selectedRows) => {
          let toLine = Number(this.toLine || 0)
          const rows = selectedRows.map(row => {
            return table.getRowIndex(row)
          })
          const list = [...this.form.detailList]

          const max = list.length - rows.length
          let targetIndex = toLine - 1
          targetIndex = targetIndex < 0 ? 0 : targetIndex
          targetIndex = targetIndex > max ? max : targetIndex
          
          const arr1 = list.filter((i, idx) => rows.includes(idx))
          let data = list.filter((i, idx) => !rows.includes(idx))
          data.splice(targetIndex, 0, ...arr1)
          table.clearCheckboxRow()
          table.setCheckboxRow(arr1.map((i, idx) => data[targetIndex + idx]), true)
          this.form.detailList = data
        }
      }
    }
  },
  methods: {
    onTableActionBtnClick(event) {
      const table = this.$refs.table
      const selectedRows = this.$refs.table.getCheckboxRecords()
      // let dataSourceData = selectedRows.filter(row=> row.dataSource==2)
      // console.log("selectedRows",dataSourceData)
      // if((event=='copy' || event=='delete') && dataSourceData.length){
      //   this.$message.error('需求池物料不可删除、不可复制');
      //   return
      // }
      if (selectedRows.length === 0) return
      const fn = this.tableActions[event]
      fn && fn(table, selectedRows)
    }
  }
}
