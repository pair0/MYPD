function yyyymmdd(timestamp , option = "FULL") {
    var d = new Date(timestamp), // Convert the passed timestamp to milliseconds
    yyyy = d.getFullYear(),
    mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
    dd = ('0' + d.getDate()).slice(-2),         // Add leading 0.
    hh = d.getHours(),
    min = ('0' + d.getMinutes()).slice(-2),     // Add leading 0.
    time;
        
    if (hh < 12) {
        h = "0" + hh
    }
    else {
        h = hh;
    }
    
    if(option == "FULL")
        // ie: 201302180835  
        time = yyyy + mm + dd + h + min
    else
        time = yyyy + mm + dd
        
    return time;
}
module.exports = {
    YYYYMMDD : yyyymmdd
}