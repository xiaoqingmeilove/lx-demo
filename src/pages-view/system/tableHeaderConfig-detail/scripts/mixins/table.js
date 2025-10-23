import XEUtils from "xe-utils";
import { rowDown, rowUp } from "../table-utils";
import { ApiQuotation } from "@/apis";
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
          const list = copyInsert(this.tableData, rows);
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
          this.reloadTableData(list)
        },
        reverse: (table, selectedRows) => {
          const list = [...this.tableData];
          const rows = selectedRows.map((row) => {
            return table.getRowIndex(row);
          });
          list.forEach((item, index) => {
            let checked = rows.includes(index);
            table.setCheckboxRow(item, !checked);
          });
        },
        moveUp: (table, selectedRows) => {
          const rows = selectedRows.map((row) => {
            return table.getRowIndex(row);
          }).sort((a, b) => a - b);
          const list = [...this.tableData];
          let frozen = [];
          let newKeys = [];
          rows.forEach((i) => {
            let idx = rowUp(list, i, frozen);
            newKeys.push(idx);
          });
          table.clearCheckboxRow();
          table.setCheckboxRow(
            newKeys.map((i) => list[i]),
            true
          );
          this.tableData = list;
        },
        moveDown: (table, selectedRows) => {
          const rows = selectedRows
            .map((row) => {
              return table.getRowIndex(row);
            })
            .sort((a, b) => b - a);
          const list = [...this.tableData];
          let frozen = [];
          let newKeys = [];
          rows.forEach((i) => {
            let idx = rowDown(list, i, frozen);
            newKeys.push(idx);
          });
          table.clearCheckboxRow();
          table.setCheckboxRow(
            newKeys.map((i) => list[i]),
            true
          );
          this.tableData = list;
        },
        toTop: (table, selectedRows) => {
          const rows = selectedRows.map((row) => {
            return table.getRowIndex(row);
          });
          const list = [...this.tableData];
          const arr1 = list.filter((i, idx) => rows.includes(idx));
          const arr2 = list.filter((i, idx) => !rows.includes(idx));
          const data = arr1.concat(arr2);
          table.clearCheckboxRow();
          table.setCheckboxRow(
            arr1.map((i, idx) => data[idx]),
            true
          );
          this.tableData = data;
        },
        toBottom: (table, selectedRows) => {
          const rows = selectedRows.map((row) => {
            return table.getRowIndex(row);
          });
          const list = [...this.tableData];
          const arr1 = list.filter((i, idx) => rows.includes(idx));
          const arr2 = list.filter((i, idx) => !rows.includes(idx));
          const data = arr2.concat(arr1);
          table.clearCheckboxRow();
          table.setCheckboxRow(
            arr1.map((i, idx) => data[data.length - arr1.length + idx]),
            true
          );
          this.tableData = data;
        },
        delete: (table, selectedRows) => {
          const rows = selectedRows.map((row) => {
            return table.getRowIndex(row);
          });
            const list = [...this.tableData];
            const data = list.filter((i, idx) => !rows.includes(idx));
            this.tableData = data;
            this.$message.success("删除成功");
        },
        toLine: (table, selectedRows) => {
          let toLine = Number(this.toLine || 0);
          const rows = selectedRows.map((row) => {
            return table.getRowIndex(row);
          });
          const list = [...this.tableData];

          const max = list.length - rows.length
          let targetIndex = toLine - 1
          targetIndex = targetIndex < 0 ? 0 : targetIndex
          targetIndex = targetIndex > max ? max : targetIndex
          
          const arr1 = list.filter((i, idx) => rows.includes(idx));
          let data = list.filter((i, idx) => !rows.includes(idx));
          data.splice(targetIndex, 0, ...arr1);
          table.clearCheckboxRow();
          table.setCheckboxRow(
            arr1.map((i, idx) => data[targetIndex + idx]),
            true
          );
          this.tableData = data;
        },
      },
    };
  },
  methods: {
    onTableActionBtnClick(event) {
      const table = this.$refs.table;
      const selectedRows = this.$refs.table.getCheckboxRecords();
      if (selectedRows.length === 0) return;
      const fn = this.tableActions[event];
      fn && fn(table, selectedRows);
    },
  },
};
