var Action = {
    tableId: "#grid-table",
    pagerId: "#grid-pager",
    table: null,
    domain: "action"
};

/**
 * jqGrid初始化参数
 */
Action.initOptions = function () {
    var options = {
        url : "/action/grid",
        postData : {
            ehsId : $("#ehsId").val()
        },
        autowidth:true,
        colNames: ['ehsId','描述', '负责人',"地址", '负责部门','负责主管','关闭时间','实际关闭时间','操作'],
        colModel: [
            {name: 'ehsId', index: 'ehsId', width: 20},
            {name: 'descriptive', index: 'descriptive', width: 80},
            {name: 'responsibleMan', index: 'responsibleMan', width: 60},
            {name: 'address', index: 'address', width: 50, sortable: false,formatter: function (cellvar, options, rowObject) {
                    if (cellvar == 'CZ') {
                        return "常州";
                    }else if(cellvar == 'CQ'){
                        return "重庆"
                    }else{
                        return "";
                    }

                }},
            {name: 'responsibleDept', index: 'responsibleDept', width: 60},
            {name: 'responsibleDirector', index: 'responsibleDirector', width: 60, sortable: false},
            {name: 'closeTime', index: 'closeTime', width: 80,align: "center", editable: false,formatter: function (cellvar, options, rowObject) {
                    if (cellvar == "" || cellvar == undefined) {
                        return "";
                    }
                    var da = new Date(cellvar);
                    return dateFtt("yyyy-MM-dd hh:mm:ss", da);
                }},
            {name: 'realCloseTime', index: 'realCloseTime', width: 80,align: "center", editable: false,formatter: function (cellvar, options, rowObject) {
                    if (cellvar == "" || cellvar == undefined) {
                        return "";
                    }
                    var da = new Date(cellvar);
                    return dateFtt("yyyy-MM-dd hh:mm:ss", da);
                }},
            {name: 'operations', index: 'operations', width: 100, sortable: false, formatter: function (cellValue, options, rowObject) {
                var imgUrl = rowObject["imgUrl"];
                var id = "'"+rowObject["id"]+"'";
                var ehsId = "'"+rowObject["ehsId"]+"'";
                var realCloseTime = rowObject["realCloseTime"];
                var str = "";
                if(""!=imgUrl&&null!=imgUrl){
                    str += '<input type="button" class=" btn btn-sm btn-success"  value="查看附件" onclick="Action.enclosure(' + id+","+ehsId + ')"/>&nbsp;';
                }
                if (""==realCloseTime||null==realCloseTime){
                    str += '<input type="button" class=" btn btn-sm btn-warning"  value="关闭" onclick="Action.closeShow(' + id + ')"/>&nbsp;';
                }


                // str += '<input type="button" class=" btn btn-sm btn-info"  value="编辑" onclick="Action.edit(' + id + ')"/>&nbsp;';
                // str += '<input type="button" class=" btn btn-sm btn-danger"  value="删除" onclick="Action.delete(' + id + ')"/>';
                return str;
            }}
        ],
        gridComplete: function () {
            var ids = $("#grid-table").getDataIDs();
            for(var i=0;i<ids.length;i++){
                var rowData = $("#grid-table").getRowData(ids[i]);
                var realCloseTime = rowData.realCloseTime;
                if(null==realCloseTime||""==realCloseTime){
                    var flag = dateDiff(rowData.closeTime);
                    if("Y"==flag){
                        $('#'+ids[i]).find("td").css("color","#d2cf1d");
                    }else if("R"==flag){
                        $('#'+ids[i]).find("td").css("color","#d23122");
                    }

                }
            }
        }

    };
    return options;
};

/**
 * 根据关键词搜索
 */
Action.search = function () {
    var searchParam = {};
    searchParam.responsibleMan = $("#responsibleMan").val();
    searchParam.responsibleDept = $("#responsibleDept").val();
    searchParam.responsibleDirector = $("#responsibleDirector").val();
    searchParam.address = $("#address").val();
    searchParam.startDate = $("#startDate").val();
    searchParam.endDate = $("#endDate").val();
    searchParam.status1 = $("#status1").val();
    searchParam.status2 = $("#status2").val();
    Action.table.reload(searchParam);
};

/**
 * 重置搜索
 */
Action.resetSearch = function () {
    $("#responsibleMan").val("");
    // $("#responsibleDept").val("---请选择---");
    $("#responsibleDirector").val("");
    $("#address").empty();
    $("#address").append("<option value=''>---请选择---</option> <option value='CZ' >常州</option><option value='CQ'>重庆</option>");
    $("#responsibleDept").empty();//find("option[value='']").attr("selected",true);
    $("#responsibleDept").append("<option value=''>---请选择---</option>");
    $("#startDate").val("");
    $("#endDate").val("");
    $("#status1").val("");
    $("#status2").val("");
    Action.search();
};

/**
 *新增
 */
Action.enclosure = function (id,ehsId) {
    window.location.href = "/action/enclosureAction?id="+id+"&ehsId="+ehsId;
}
/**
 * 导出
 */
Action.export = function (ehsId) {
    $.ajax({
        type : 'POST',
        url: '/action/prepareExportData',
        contentType : "application/json" ,
        data: JSON.stringify({
            ehsId : ehsId,
            responsibleMan : $("#responsibleMan").val(),
            responsibleDept : $("#responsibleDept").val(),
            responsibleDirector : $("#responsibleDirector").val(),
            address : $("#address").val(),
            startDate : $("#startDate").val(),
            endDate : $("#endDate").val(),
            status1 : $("#status1").val(),
            status2 : $("#status2").val()
        }),
        success : function() {
            window.open("/action/export");
        }

    });
}



/**
 * 删除
 *
 * @param id    userId
 */
Action.delete = function (id) {
    warning("确定删除吗", "", function () {
        $.get("/action/delete?id=" + id, function () {
            success("成功删除");
            Action.search();
        });
    })
};

/**
 * 关闭
 *
 * @param id    userId
 */
Action.closeShow = function (id) {
    console.log(id)
    $("#closeId").val(id);
    $("#closeModal").modal();
    // input("确定关闭吗？", "请输入关闭理由", function (inputValue) {
    //     if (inputValue === false) return false;
    //     if (inputValue === "") {
    //         swal.showInputError("内容不能为空，请输入关闭理由！");
    //         return false
    //     }
    //     $.get("/action/close?id=" + id+"&closeReason="+inputValue, function(){
    //         success("关闭成功");
    //         Action.search();
    //     });
    // })
};
Action.close = function () {
    var form = $("#close-form");
    var action = {};
    action.closeId = form.find("input[name='closeId']").val()
    action.closeReason =  form.find("input[name='closeReason']").val();
    action.closeDate =  form.find("input[name='closeDate']").val();
    if(""==action.closeReason||null==action.closeReason){
        error("关闭理由不能为空")
        return ;
    }

    $.ajax({
        url: "/action/close",
        type: 'post',
        data: JSON.stringify(action),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (r) {
            if (r.code === 0) {
                $("#closeModal").modal("hide");
                form.find("input[name='closeReason']").val("");
                Action.search();
            }
        }
    })
}



Action.insert = function (btn) {
    var email = $("#email").val();
    if(null==email||""==email){
        error("责任人邮件地址不能为空");
        return;
    }
    var directorEmail = $("#directorEmail").val();
    if(null==directorEmail||""==directorEmail){
        error("责任主管邮件地址不能为空");
        return;
    }
    var action = getFormJson($("#create-form"));
    var l = $(btn).ladda();
    l.ladda('start');
    $.ajax({
        url: "/action/insert",
        type: 'POST',
        data: JSON.stringify(action),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (r) {
            if (r.code === 0) {
                // $("#createModal").modal("hide");
                l.ladda('stop');
                successthen("保存成功",null,"/backstage/list");
                // $("#create-form")[0].reset();
            }
        }
    })
}





function dateFtt(fmt,date) { //author: meizz
        var o = {
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
}

function dateDiff(date) { //author: meizz
    //指定关闭时间
    var time = Date.parse(new Date(date));
    //当前时间
    var ctime = Date.parse(new Date());
    var diff = (time-ctime)/1000;
    // console.log(diff)
    if(-86400*7<diff&&diff<86400*3){
        return "Y";
    }else if (diff<-86400*7){
        return "R";
    }else{
        return "N";
    }

}

$(function() {
    $('.chosen-select').chosen({width: "100%"});
    var jqGrid = new JqGrid("#grid-table", "#grid-pager", Action.initOptions());
    Action.table = jqGrid.init();

});