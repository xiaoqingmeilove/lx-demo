import store from "@/store";
import moment from "moment";
const user = store.state.User.userInfo;

const handContent = (form) => {
  // const str = `<p style="text-align: start;"> &nbsp; &nbsp; &nbsp;1.供应商A公司名称：XX科技有限公司中标项目：【项目名称】中标金额：XXXX万元</p>`;
  const str = (form.supplierList||[]).filter(x=>x.bidResult === 'WIN'||x.bidResult==='PARTIAL_WIN').reduce((group, item, index)=>{
    group += `<p style="text-align: start;"> &nbsp; &nbsp; &nbsp;${index + 1}. ${item?.businessLicense??''}中标项目：${form?.projectName??''} 中标金额：${item.amount}元</p>`;
    return group;
  }, '');

  let html = `
    <p style="text-align: start;">尊敬的供应商及相关单位：</p>
    <p style="text-align: start;"> &nbsp; &nbsp; ${user.clientName ?? ''}于${form.auditDate}完成了${form.projectName ?? ''}（项目编号：${form.billNo ?? ''}）
    的采购招标工作。现将本次采购中标的结果公布如下：</p>
    <h4 style="text-align: start;"> &nbsp; &nbsp; &nbsp;一、采购人名称</h4>
    <p style="text-align: start;"> &nbsp; &nbsp; ${user.clientName ?? ''}</p>
    <h4 style="text-align: start;"> &nbsp; &nbsp; &nbsp;二、采购项目名称</h4>
    <p style="text-align: start;"> &nbsp; &nbsp; &nbsp;${form.projectName ?? ''} </p>
    <h4 style="text-align: start;"> &nbsp; &nbsp; &nbsp;三、采购编号</h4>
    <p style="text-align: start;"> &nbsp; &nbsp; &nbsp;${form.billNo ?? ''}</p>
    <h4 style="text-align: start;"> &nbsp; &nbsp; &nbsp;四、采购方式</h4>
    <p style="text-align: start;"> &nbsp; &nbsp; &nbsp;询价采购</p>
    <h4 style="text-align: start;"> &nbsp; &nbsp; &nbsp;五、中标供应商</h4>
    ${str}
    <h4 style="text-align: start;"> &nbsp; &nbsp; &nbsp;六、评审结果公示</h4>
    <p style="text-align: start;"> &nbsp; &nbsp; &nbsp; &nbsp;评审委员会严格按照招标文件规定的程序和标准，对所有投标文件进行了全面、公正、公平的评审。评审过程透明、公开，确保了评审结果的公正性和准确性。</p>
    <h4 style="text-align: start;"> &nbsp; &nbsp; &nbsp;七、中标通知书</h4>
    <p style="text-align: start;"> &nbsp; &nbsp; &nbsp;本公司将在本公告发布后5个工作日内，向中标供应商发出《中标通知书》。请中标供应商在收到《中标通知书》后，按要求办理相关手续，签订合同。</p>
    <h4 style="text-align: start;"> &nbsp; &nbsp; &nbsp;八、其他事项</h4>
    <p style="text-align: start;"> &nbsp; &nbsp; &nbsp;对于未中标的供应商，我们衷心感谢您对本次招标工作的积极参与和支持。尽管未能中标，您的参与对我们来说同样重要，希望在未来的合作机会中继续得到您的支持。</p>
    <p style="text-align: start;"> &nbsp; &nbsp; &nbsp;如对本次评审结果有异议，可在本公告发布之日起7个工作日内，向本公司采购部提出书面质疑。我们将及时予以答复。</p>
    <h4 style="text-align: start;"> &nbsp; &nbsp; &nbsp;联系方式</h4>
    <p style="text-align: start;"> &nbsp; &nbsp; &nbsp;如有任何疑问或需要进一步的信息，请联系：</p>
    <p style="text-align: start;"> &nbsp; &nbsp; &nbsp;联系人：${form.inquiryUserName||''}</p>
    <p style="text-align: start;"> &nbsp; &nbsp; &nbsp;联系电话：${form.linkerTel||''}</p>
    <p style="text-align: start;"> &nbsp; &nbsp; &nbsp;电子邮箱：${form.linkerEmail||''}</p>
    <p style="text-align: start;"> &nbsp; &nbsp; &nbsp;特此公告。</p>
    <p style="text-align: start;"> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;${user.clientName ?? ''}</p>
    <p style="text-align: start;"> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;采购部 </p>
    <p style="text-align: start;"> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ${moment().format('YYYY-MM-DD HH:mm:ss')}</p>
  `
  return html
};

export {
  handContent
};