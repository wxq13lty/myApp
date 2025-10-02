const dialog = (content:string)=>{
    //创建对话框
    const dialogHtml = document.createElement('dialog')
    dialogHtml.innerHTML = content
    document.head.appendChild(dialogHtml)
    return dialogHtml
}
export default  dialog