class Utils{
    //metódo estático sem ocerrência de objetos;
    static dateFormat(date){
        return date.getDate()+'/'+(date.getMonth()+1)+'/' +date.getFullYear()+'/'+date.getHours()+':'+date.getMinutes();
    }

}