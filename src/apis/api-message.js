import request from '@/utils/request'
import { resolveUrl } from '@/utils/resolve-url'

const URLs = {
    getInnerMessage: resolveUrl('message-center/message/send/inner/list'), //获取站内消息
    updateMessageStatus: resolveUrl('message-center/message/send/inner/readed/byIds'), //更新消息状态
    updateAllMessageStatus: resolveUrl('message-center/message/send/inner/readed'), //全部已读
    getMessageApply: resolveUrl('message-center/configManager/application/typeList'), //获取站内消息
    
    //日程管理
    getCalendar: resolveUrl('calendar/calendar_info/getList'), //查询
    addCalendar: resolveUrl('calendar/calendar_info/save'), //新增
    updateCalendar: resolveUrl('calendar/calendar_info/edit'), //编辑
    detailCalendar: resolveUrl('calendar/calendar_info/getInfoById'), //详情
    deleteCalendar: resolveUrl('calendar/calendar_info/delCalendar'), //删除

    //日程通知
    updateInfo: resolveUrl('calendar/calendar_info/editMsg'), //日程更新通知
    remindInfo: resolveUrl('calendar/calendar_info/remind'), //提醒通知
    pushInfo: resolveUrl('calendar/calendar_info/urge'), //催促通知
    removeInfo: resolveUrl('calendar/calendar_info/delMsg'), //移除通知

    //日程提醒
    getCalRemind: resolveUrl('calendar/calendar_remind/getList'), //日程提醒列表
    updateRemind: resolveUrl('calendar/calendar_remind/saveRemind'), //日程提醒维护
    deleteRemind: resolveUrl('calendar/calendar_remind/removeById'), //日程提醒删除

    //参与人
    addPlayer: resolveUrl('calendar/calendar_player/save'), //添加参与人
    removePlayer: resolveUrl('calendar/calendar_player/removeById'), //移除参与人

    //执行人
    addExecutor: resolveUrl('calendar/calendar_executor/save'), //添加执行人
    removeExecutor: resolveUrl('calendar/calendar_executor/removeById'), //移除执行人
    exchangeExecutor: resolveUrl('calendar/calendar_executor/executor_player'), //变更为参与人
    completeExecutor: resolveUrl('calendar/calendar_executor/CalendarAccomplish'), //执行人完成待办
    concludeCal: resolveUrl('calendar/calendar_info/CalendarConclude'),

    //关联业务
    addModuleBill: resolveUrl('calendar/calendar_tos/save'), //添加业务单据
    removeModuleBill: resolveUrl('calendar/calendar_tos/removeById'), //删除业务单据

    //日程评论
    getCalComment: resolveUrl('calendar/comment/getComment'), //查询评论
    addCalComment: resolveUrl('calendar/comment/addComment'), //添加评论

    //日程附件
    addCalFiles: resolveUrl('calendar/calendar_file/save'), //添加附件
    getCalFiles: resolveUrl('calendar/calendar_file/getFiles'), //查询附件
    removeCalFiles: resolveUrl('calendar/calendar_file/removeById'), //移除附件

    ///////////////////////////////////////////////////////////////////////////

    //代办数量
    getTodoCount: resolveUrl('calendar/backlog_info/getListCount'), //个人待办列表

    //个人待办
    getUserTodo: resolveUrl('calendar/backlog_info/getList'), //个人待办列表
    addUserTodo: resolveUrl('calendar/backlog_info/save'), //个人待办添加
    updateUserTodo: resolveUrl('calendar/backlog_info/edit'), //个人待办更新
    detailUserTodo: resolveUrl('calendar/backlog_info/getInfoById'), //个人待办详情
    deleteUserTodo: resolveUrl('calendar/backlog_info/delBacklog'), //个人待办删除
    updatePeopleTodo: resolveUrl('calendar/backlog_info/editPeople'), //个人待办子业务更新

    //待办通知
    updateTodoInfo: resolveUrl('calendar/backlog_info/editMsg'), //待办更新通知
    remindTodoInfo: resolveUrl('calendar/backlog_info/remind'), //待办提醒通知
    pushTodoInfo: resolveUrl('calendar/backlog_info/urge'), //待办催促通知
    removeTodoInfo: resolveUrl('calendar/backlog_info/delMsg'), //待办移除通知

    //日程提醒
    getTodoRemind: resolveUrl('calendar/backlog_remind/getList'), //日程提醒列表
    updateTodoRemind: resolveUrl('calendar/backlog_remind/saveRemind'), //日程提醒维护
    deleteTodoRemind: resolveUrl('calendar/backlog_remind/removeById'), //日程提醒删除

    //参与人
    addTodoPlayer: resolveUrl('calendar/backlog_player/save'), //添加参与人
    removeTodoPlayer: resolveUrl('calendar/backlog_player/removeById'), //移除参与人

    //执行人
    addTodoExecutor: resolveUrl('calendar/backlog_executor/save'), //添加执行人
    removeTodoExecutor: resolveUrl('calendar/backlog_executor/removeById'), //移除执行人
    exchangeTodoExecutor: resolveUrl('calendar/calendar_executor/executor_player'), //变更为参与人
    completeTodoExecutor: resolveUrl('calendar/backlog_executor/BacklogAccomplish'), //执行人完成待办
    concludeTodo: resolveUrl('calendar/backlog_info/BacklogConclude'), //待办办结

    //关联业务
    addTodoModuleBill: resolveUrl('calendar/backlog_tos/save'), //添加业务单据
    removeTodoModuleBill: resolveUrl('calendar/backlog_tos/removeById'), //删除业务单据

    //待办评论
    getTodoComment: resolveUrl('calendar/backlog_comment/getComment'), //查询评论
    addTodoComment: resolveUrl('calendar/backlog_comment/addComment'), //添加评论

    //待办附件
    addTodoFiles: resolveUrl('calendar/backlog_file/save'), //添加附件
    getTodoFiles: resolveUrl('calendar/backlog_file/getFiles'), //查询附件
    removeTodoFiles: resolveUrl('calendar/backlog_file/removeById'), //移除附件

    //工作待办
    getWorkList: resolveUrl('home/backlog/getBacklogList'), //模块查询
    getWorkType: resolveUrl('home/backlog/getBacklogType'), //类型查询

}

class ApiInstance {
    //站内消息列表
    getInnerMessage(data) {
        return request({ method:'post', url:URLs.getInnerMessage, data })
    }
    //读取状态更新
    updateMessageStatus(data) {
        return request({ method:'post', url:URLs.updateMessageStatus, data:{ids:data} })
    }
    // 全部已读
    updateAllMessageStatus() {
        return request({ method:'get', url:URLs.updateAllMessageStatus})
    }
    //消息应用查询
    getMessageApply() {
        return request({ method:'get', url:URLs.getMessageApply })
    }

    //日程管理
    getCalendar(data={}) {
        return request({ method:'get', url:URLs.getCalendar, params:data })
    }
    addCalendar(data) {
        return request({ method:'post', url:URLs.addCalendar, data })
    }
    updateCalendar(data) {
        return request({ method:'put', url:URLs.updateCalendar, data })
    }
    detailCalendar(id) {
        return request({ method:'get', url:URLs.detailCalendar, params:{id} })
    }
    deleteCalendar(id) {
        return request({ method:'put', url:URLs.deleteCalendar+'?id='+id })
    }

    //日程通知
    updateInfo(data) {
        return request({ method:'post', url:URLs.updateInfo, data })
    }
    remindInfo(data) {
        return request({ method:'post', url:URLs.remindInfo, data })
    }
    pushInfo(data) {
        return request({ method:'post', url:URLs.pushInfo, data })
    }
    removeInfo(data) {
        return request({ method:'post', url:URLs.removeInfo, data })
    }

    //日程提醒
    getCalRemind() {
        return request({ method:'get', url:URLs.getCalRemind })
    }
    updateRemind(data) {
        return request({ method:'post', url:URLs.updateRemind, data })
    }
    deleteRemind(data) {
        return request({ method:'delete', url:URLs.deleteRemind, data })
    }

    //参与人 执行人
    addPlayer(data) {
        return request({ method:'post', url:URLs.addPlayer, data })
    }
    removePlayer(data) {
        return request({ method:'delete', url:URLs.removePlayer, data })
    }
    addExecutor(data) {
        return request({ method:'post', url:URLs.addExecutor, data })
    }
    removeExecutor(data) {
        return request({ method:'delete', url:URLs.removeExecutor, data })
    }
    exchangeExecutor(data) {
        return request({ method:'post', url:URLs.exchangeExecutor, data })
    }
    completeExecutor(id) {
        return request({ method:'put', url:URLs.completeExecutor+'?id='+id })
    }
    concludeCal(id) {
        return request({ method:'put', url:URLs.concludeCal+'?id='+id })
    }
    
    //关联业务
    addModuleBill(data) {
        return request({ method:'post', url:URLs.addModuleBill, data })
    }
    removeModuleBill(data) {
        return request({ method:'delete', url:URLs.removeModuleBill, data })
    }

    //日程评论
    getCalComment(masterId){
        return request({ method:'get', url:URLs.getCalComment, params:{masterId} })
    }
    addCalComment(data){
        return request({ method:'post', url:URLs.addCalComment, data })
    }

    //日程附件
    addCalFiles(data){
        return request({ method:'post', url:URLs.addCalFiles, data })
    }
    getCalFiles(calendarId){
        return request({ method:'get', url:URLs.getCalFiles, params:{calendarId} })
    }
    removeCalFiles(data){
        return request({ method:'delete', url:URLs.removeCalFiles, data })
    }

    ///////////////////////////////////////////////////////////////////////////////

    //代办数量
    getTodoCount() {
        return request({ method:'get', url:URLs.getTodoCount })
    }

    //个人待办
    getUserTodo(data) {
        return request({ method:'get', url:URLs.getUserTodo, params:{...data} })
    }
    addUserTodo(data) {
        return request({ method:'post', url:URLs.addUserTodo, data })
    }
    updateUserTodo(data) {
        return request({ method:'put', url:URLs.updateUserTodo, data })
    }
    detailUserTodo(id) {
        return request({ method:'get', url:URLs.detailUserTodo, params:{id} })
    }
    deleteUserTodo(id) {
        return request({ method:'put', url:URLs.deleteUserTodo, params:{id} })
    }
    updatePeopleTodo(data) {
        return request({ method:'put', url:URLs.updatePeopleTodo, data })
    }

    //待办通知
    updateTodoInfo(data) {
        return request({ method:'post', url:URLs.updateTodoInfo, data })
    }
    remindTodoInfo(data) {
        return request({ method:'post', url:URLs.remindTodoInfo, data })
    }
    pushTodoInfo(data) {
        return request({ method:'post', url:URLs.pushTodoInfo, data })
    }
    removeTodoInfo(data) {
        return request({ method:'post', url:URLs.removeTodoInfo, data })
    }

    //待办提醒
    getTodoRemind() {
        return request({ method:'get', url:URLs.getTodoRemind })
    }
    updateTodoRemind(data) {
        return request({ method:'post', url:URLs.updateTodoRemind, data })
    }
    deleteTodoRemind(data) {
        return request({ method:'delete', url:URLs.deleteTodoRemind, data })
    }

    //待办参与人 待办执行人
    addTodoPlayer(data) {
        return request({ method:'post', url:URLs.addTodoPlayer, data })
    }
    removeTodoPlayer(data) {
        return request({ method:'delete', url:URLs.removeTodoPlayer, data })
    }
    addTodoExecutor(data) {
        return request({ method:'post', url:URLs.addTodoExecutor, data })
    }
    removeTodoExecutor(data) {
        return request({ method:'delete', url:URLs.removeTodoExecutor, data })
    }
    exchangeTodoExecutor(data) {
        return request({ method:'post', url:URLs.exchangeTodoExecutor, data })
    }
    completeTodoExecutor(id) {
        return request({ method:'put', url:URLs.completeTodoExecutor+'?id='+id })
    }
    concludeTodo(id) {
        return request({ method:'put', url:URLs.concludeTodo+'?id='+id })
    }
    
    //待办关联业务
    addTodoModuleBill(data) {
        return request({ method:'post', url:URLs.addTodoModuleBill, data })
    }
    removeTodoModuleBill(data) {
        return request({ method:'delete', url:URLs.removeTodoModuleBill, data })
    }

    //待办评论
    getTodoComment(masterId){
        return request({ method:'get', url:URLs.getTodoComment, params:{masterId} })
    }
    addTodoComment(data){
        return request({ method:'post', url:URLs.addTodoComment, data })
    }

    //待办附件
    addTodoFiles(data){
        return request({ method:'post', url:URLs.addTodoFiles, data })
    }
    getTodoFiles(backlogId){
        return request({ method:'get', url:URLs.getTodoFiles, params:{backlogId} })
    }
    removeTodoFiles(data){
        return request({ method:'delete', url:URLs.removeTodoFiles, data })
    }

    //工作待办
    getWorkList(data){
        return request({ method:'post', url:URLs.getWorkList, data })
    }
    getWorkType(data){
        return request({ method:'post', url:URLs.getWorkType, data })
    }

}

export default ApiInstance