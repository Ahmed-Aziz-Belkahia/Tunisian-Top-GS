$(document).ready(function() {
    $('#mySelect').select2({
        placeholder: 'Select a Professor'
    });
    $('#mySelect2').select2({
        placeholder: 'Select a Category'
    });
    renderTempMap('',-1);
    if (edit_flow == 1){
        initObjects();
    }
});

edit_flow = 0;

level_count = 0;
module_count = 0;
video_count = 0;
quiz_count = 0;

tempMap = [];

function checkVal(id) {
	temp = document.getElementById(id);
	if (temp.value + "") {
		return true;
	}
	temp.focus();
	return false;
}

function validateCourseForm() {
	if (checkVal('title') == false) {
		window.alert("Please enter a Title");
		return false;
	}
	if (checkVal('desc') == false) {
		window.alert("Please enter a Description");
		return false;
	}
	if (checkVal('price') == false) {
		window.alert("Please enter a Price");
		return false;
	}
	if (checkVal('mem') == false) {
		window.alert("Please enter a Member Count");
		return false;
	}
	if (checkVal('mySelect2') == false) {
		window.alert("Please select a Category");
		return false;
	}
	if (checkVal('course-req') == false) {
		window.alert("Please enter Course Requirements");
		return false;
	}
	if (checkVal('course-fea') == false) {
		window.alert("Please enter Course Features");
		return false;
	}
	return true;
}

function populateQuizOptsIds(quiz_id){
    quiz_opt_ids = "";
    answer_holder = document.getElementById('quiz-temp-'+quiz_id+'-answer-holder');
    if (answer_holder.children && answer_holder.children.length > 0){
        new_id = parseInt(answer_holder.children[answer_holder.children.length-1].id.split("-")[4]) + 1;
        for (i=1 ; i<new_id ; i++){
            temp = document.getElementById('quiz-temp-'+quiz_id+"-title"+i);
            temp2 = document.getElementById('quiz-temp-'+quiz_id+"-image"+i);
            if (temp && (temp.value || temp2.value)){
                quiz_opt_ids += i;
                quiz_opt_ids += "-";
            }
        }
    }
    document.getElementById('quiz-temp-'+quiz_id+'-answers').value = quiz_opt_ids;
}

function submitCourseForm(actionType){
    isValid = validateCourseForm();
    if (isValid){
        document.getElementById("actionSubmit").value = actionType;
        form = document.getElementById("admin-add-form");
        quiz_ids = []
        val = "";
        if (tempMap && tempMap.length > 0){
            for (i=0 ; i < tempMap.length ; i++){
                val += "level(";
                val += tempMap[i]['id'];
                val += "-";
                tempModules = tempMap[i]['modules'];
                if (tempModules && tempModules.length > 0){
                    for (j=0 ; j < tempModules.length ; j++){
                        val += "module(";
                        val += tempModules[j]['id'];
                        val += "-";
                        tempVideos = tempModules[j]['videos'];
                        if (tempVideos && tempVideos.length > 0){
                            for (k=0 ; k < tempVideos.length ; k++){
                                val += "video(";
                                val += tempVideos[k]['id'];
                                val += "-";
                                tempQuiz = tempVideos[k]['quiz'];
                                if (tempQuiz && tempQuiz.length > 0){
                                    for (l=0 ; l < tempQuiz.length ; l++){
                                        val += "quiz(";
                                        val += tempQuiz[l]['id'];
                                        val += "-";
                                        quiz_ids.push(tempQuiz[l]['id']);
                                    }
                                    val += ")";
                                }
                                val += ")";
                            }
                        }
                        val += ")";
                    }
                }
                val += ")";
            }
        }
        for (a=0 ; a < quiz_ids.length ; a++){
            populateQuizOptsIds(quiz_ids[a]);
        }
        document.getElementById("courseHier").value = val;
        form.submit();
    }
}

function saving_check(){
    sav_check = document.getElementById("saving-check");
    if (edit_flow == 1 && sav_check){
        if (sav_check.checked){
            submitCourseForm(3);
        }
    }
}

function renderTempMap(selected_item, selected_id){
    data = [];
    open_id = [];
    if (tempMap && tempMap.length > 0){
        for (i=0 ; i < tempMap.length ; i++){
            tempModules = tempMap[i]['modules'];

            tempLevelText = tempMap[i]['title'];
            tempLevelText += '&emsp;&ensp;<i class="text-success fas fa-plus pointer" title="Add Module To This Level" onclick="add_new_module(\''+tempMap[i]['id']+'\')"></i>';
            tempLevelText += '&emsp;&ensp;<i class="text-info fas fa-edit pointer" title="Edit" onclick="$(\'#level-temp-'+tempMap[i]['id']+'\').modal(\'show\')"></i>';
            tempLevelText += '&emsp;&ensp;<i class="text-danger fas fa-trash pointer" title="Delete" onclick="delete_level(\'level-temp-'+tempMap[i]['id']+'\')"></i>';
            tempL = {id:tempMap[i]['id'], text: tempLevelText, children: [], color: "blue"};

            if (tempModules && tempModules.length > 0){
                for (j=0 ; j < tempModules.length ; j++){
                    tempVideos = tempModules[j]['videos'];

                    tempModuleText = tempModules[j]['title'];
                    tempModuleText += '&emsp;&ensp;<i class="text-success fas fa-plus pointer" title="Add Video To This Module" onclick="add_new_video(\''+tempModules[j]['id']+'\')"></i>';
                    tempModuleText += '&emsp;&ensp;<i class="text-info fas fa-edit pointer" title="Edit" onclick="$(\'#module-temp-'+tempModules[j]['id']+'\').modal(\'show\')"></i>';
                    tempModuleText += '&emsp;&ensp;<i class="text-danger fas fa-trash pointer" title="Delete" onclick="delete_module(\'module-temp-'+tempModules[j]['id']+'\')"></i>';
                    mid = tempMap[i]['id']+"-"+tempModules[j]['id'];
                    tempM = {id: mid, text: tempModuleText, children: [], color: "green"};

                    if (selected_item == 'm' && selected_id == tempMap[i]['id']){
                        open_id = [tempMap[i]['id']];
                    }

                    if (tempVideos && tempVideos.length > 0){
                        for (k=0 ; k < tempVideos.length ; k++){
                            tempQuiz = tempVideos[k]['quiz'];

                            tempVideoText = tempVideos[k]['title'];
                            tempVideoText += '&emsp;&ensp;<i class="text-success fas fa-plus pointer" title="Add Quiz To This Video" onclick="add_new_quiz(\''+tempVideos[k]['id']+'\')"></i>';
                            tempVideoText += '&emsp;&ensp;<i class="text-info fas fa-edit pointer" title="Edit" onclick="$(\'#video-temp-'+tempVideos[k]['id']+'\').modal(\'show\')"></i>';
                            tempVideoText += '&emsp;&ensp;<i class="text-danger fas fa-trash pointer" title="Delete" onclick="delete_video(\'video-temp-'+tempVideos[k]['id']+'\')"></i>';
                            vid = mid + "-" + tempVideos[k]['id'];
                            tempV = {id: vid, text: tempVideoText, children: [], color: "purple"}

                            if (selected_item == 'v' && selected_id == tempModules[j]['id']){
                                open_id = [tempMap[i]['id'],mid];
                            }

                            if (tempQuiz && tempQuiz.length > 0){
                                for (l=0 ; l < tempQuiz.length ; l++){
                                    tempQuizText = tempQuiz[l]['title'];
                                    tempQuizText += '&emsp;&ensp;<i class="text-info fas fa-edit pointer" title="Edit" onclick="$(\'#quiz-temp-'+tempQuiz[l]['id']+'\').modal(\'show\')"></i>';
                                    tempQuizText += '&emsp;&ensp;<i class="text-danger fas fa-trash pointer" title="Delete" onclick="delete_quiz(\'quiz-temp-'+tempQuiz[l]['id']+'\')"></i>';
                                    qid = vid + "-" + tempQuiz[l]['id'];
                                    tempV.children.push({id: qid, text: tempQuizText, children: [], color: "orange"});

                                    if (selected_item == 'q' && selected_id == tempVideos[k]['id']){
                                        open_id = [tempMap[i]['id'],mid,vid];
                                    }
                                }
                            }
                            tempM.children.push(tempV);
                        }
                    }
                    tempL.children.push(tempM);
                }
            }
            data.push(tempL);
        }
    }

    tree = new Tree(".tree-container", {
        data: data,
        loaded: function () {

            if (open_id){
                for (i=0 ; i<open_id.length ; i++){
                    $("#"+open_id[i]).click();
                }
            }
        }
    });
}

function add_new_level(){
    if (document.getElementById('level-temp-'+level_count)){
        document.getElementById('level-temp-'+level_count).remove();
    }
    new_level = $('#level-temp').prop('outerHTML');
    new_level = new_level.replaceAll("level-temp","level-temp-"+level_count);
    document.getElementById('admin-add-form').insertAdjacentHTML('beforeend',new_level);
    $('#level-temp-'+level_count).modal('show');
}

function confirm_add_level(prefix){
    if (!$('#'+prefix+'-level-no').val()){
        window.alert("Please enter a level number!");
        return;
    }
    if (!$('#'+prefix+'-title').val()){
        window.alert("Please enter a title!");
        return;
    }
    if (!$('#'+prefix+'-desc').val()){
        window.alert("Please enter a description!");
        return;
    }
    check = true;
    level_id = prefix.split('-')[2];
    for (i=0 ; i<tempMap.length ; i++){
        if (tempMap[i]['id'] == parseInt(level_id)){
            tempMap[i]['title'] = $('#'+prefix+'-title').val();
            check = false;
        }
    }
    if (check){
        tempMap.push({'id':level_count,'title':$('#'+prefix+'-title').val(),'modules':[]});
        level_count += 1;
    }
    $('#'+prefix).modal('hide');
    renderTempMap('l',level_id);

    saving_check();
}

function delete_level(prefix){
    if (edit_flow == 1){
        delLevel = document.getElementById(prefix+"-id");
        if (delLevel){
            document.getElementById("del-levels").value = document.getElementById("del-levels").value + delLevel.value + "-";
        }
    }

    ids_to_remove = [prefix];
    level_id = prefix.split('-')[2];
    if (tempMap && tempMap.length > 0){
        for (i=0 ; i < tempMap.length ; i++){
            if (tempMap[i]['id'] == parseInt(level_id)){
                tempModules = tempMap[i]['modules'];
                if (tempModules && tempModules.length > 0){
                    for (j=0 ; j < tempModules.length ; j++){
                        ids_to_remove.push("module-temp-"+tempModules[j]['id']);
                        tempVideos = tempModules[j]['videos'];
                        if (tempVideos && tempVideos.length > 0){
                            for (k=0 ; k < tempVideos.length ; k++){
                                ids_to_remove.push("video-temp-"+tempVideos[k]['id']);
                                tempQuiz = tempVideos[k]['quiz'];
                                if (tempQuiz && tempQuiz.length > 0){
                                    for (l=0 ; l < tempQuiz.length ; l++){
                                        ids_to_remove.push("quiz-temp-"+tempQuiz[l]['id']);
                                    }
                                }
                            }
                        }
                    }
                }
                tempMap.splice(i,1);
            }
        }
    }
    renderTempMap('l',-1);
    for (i=0 ; i < ids_to_remove.length ; i++){
        $('#'+ids_to_remove[i]).modal('hide');
        document.getElementById(ids_to_remove[i]).remove();
    }
    saving_check();
}

function add_new_module(level_id){
    if (document.getElementById('module-temp-'+module_count)){
        document.getElementById('module-temp-'+module_count).remove();
    }
    new_module = $('#module-temp').prop('outerHTML');
    new_module = new_module.replaceAll("module-temp","module-temp-"+module_count);
    new_module = new_module.replaceAll("level_id",level_id);
    document.getElementById('admin-add-form').insertAdjacentHTML('beforeend',new_module);
    $('#module-temp-'+module_count+'-req').select2({
        placeholder: 'Select a Requirement'
    });
    $('#module-temp-'+module_count).modal('show');
}

function confirm_add_module(prefix,level_id){
    if (!$('#'+prefix+'-title').val()){
        window.alert("Please enter a title!");
        return;
    }
    if (!$('#'+prefix+'-index').val()){
        window.alert("Please enter an index!");
        return;
    }
    if (!$('#'+prefix+'-desc').val()){
        window.alert("Please enter a description!");
        return;
    }
    check = true;
    module_id = prefix.split('-')[2];
    for (i=0 ; i<tempMap.length ; i++){
        tempModules = tempMap[i]['modules'];
        for (j=0 ; j<tempModules.length ; j++){
            if (tempModules[j]['id'] == parseInt(module_id)){
                tempMap[i]['modules'][j]['title'] = $('#'+prefix+'-title').val();
                check = false;
            }
        }
    }
    if (check){
        for (i=0 ; i < tempMap.length ; i++){
            if (tempMap[i]['id'] == level_id){
                tempMap[i]['modules'].push({'id':module_count,'title':$('#'+prefix+'-title').val(),'videos':[]});
            }
        }
        module_count += 1;
    }
    $('#'+prefix).modal('hide');
    renderTempMap('m',''+level_id);

    saving_check();
}

function delete_module(prefix){
    if (edit_flow == 1){
        delLevel = document.getElementById(prefix+"-id");
        if (delLevel){
            document.getElementById("del-modules").value = document.getElementById("del-modules").value + delLevel.value + "-";
        }
    }

    ids_to_remove = [prefix];
    module_id = prefix.split('-')[2];
    if (tempMap && tempMap.length > 0){
        for (i=0 ; i < tempMap.length ; i++){
            tempModules = tempMap[i]['modules'];
            if (tempModules && tempModules.length > 0){
                for (j=0 ; j < tempModules.length ; j++){
                    if (tempModules[j]['id'] == parseInt(module_id)){
                        tempLevelId = tempMap[i]['id'];
                        tempVideos = tempModules[j]['videos'];
                        if (tempVideos && tempVideos.length > 0){
                            for (k=0 ; k < tempVideos.length ; k++){
                                ids_to_remove.push("video-temp-"+tempVideos[k]['id']);
                                tempQuiz = tempVideos[k]['quiz'];
                                if (tempQuiz && tempQuiz.length > 0){
                                    for (l=0 ; l < tempQuiz.length ; l++){
                                        ids_to_remove.push("quiz-temp-"+tempQuiz[l]['id']);
                                    }
                                }
                            }
                        }
                        tempModules.splice(j,1);
                        tempMap[i]['modules'] = tempModules;
                    }
                }
            }
        }
    }
    renderTempMap('m',tempLevelId);
    for (i=0 ; i < ids_to_remove.length ; i++){
        $('#'+ids_to_remove[i]).modal('hide');
        document.getElementById(ids_to_remove[i]).remove();
    }

    saving_check();
}

async function add_new_video(module_id){
    mod = await import("/static/admin/courses/ckmod.js");
    if (document.getElementById('video-temp-'+video_count)){
        document.getElementById('video-temp-'+video_count).remove();
    }
    new_video = $('#video-temp').prop('outerHTML');
    new_video = new_video.replaceAll("video-temp","video-temp-"+video_count);
    new_video = new_video.replaceAll("module_id",module_id);
    document.getElementById('admin-add-form').insertAdjacentHTML('beforeend',new_video);
    $('#video-temp-'+video_count+'-req').select2({
        placeholder: 'Select a Requirement'
    });
    mod['createCKEditor']('#video-temp-'+video_count+'-summary');
    mod['createCKEditor']('#video-temp-'+video_count+'-notes');
    $('#video-temp-'+video_count).modal('show');
}

function confirm_add_video(prefix,module_id){
    if (!$('#'+prefix+'-index').val()){
        window.alert("Please enter a video number!");
        return;
    }
    if (!$('#'+prefix+'-title').val()){
        window.alert("Please enter a title!");
        return;
    }
    check = true;
    video_id = prefix.split('-')[2];
    for (i=0 ; i<tempMap.length ; i++){
        tempModules = tempMap[i]['modules'];
        for (j=0 ; j<tempModules.length ; j++){
            tempVideos = tempModules[j]['videos'];
            for (k=0 ; k<tempVideos.length ; k++){
                if (tempVideos[k]['id'] == parseInt(video_id)){
                    tempMap[i]['modules'][j]['videos'][k]['title'] = $('#'+prefix+'-title').val();
                    check = false;
                }
            }
        }
    }
    if (check){
        for (i=0 ; i < tempMap.length ; i++){
            for (j=0 ; j < tempMap[i]['modules'].length ; j++){
                if (tempMap[i]['modules'][j]['id'] == module_id){
                    tempMap[i]['modules'][j]['videos'].push({'id':video_count,'title':$('#'+prefix+'-title').val(),'quiz':[]});
                }
            }
        }
        video_count += 1;
    }
    $('#'+prefix).modal('hide');
    renderTempMap('v',''+module_id);

    saving_check();
}

function delete_video(prefix){
    if (edit_flow == 1){
        delLevel = document.getElementById(prefix+"-id");
        if (delLevel){
            document.getElementById("del-videos").value = document.getElementById("del-videos").value + delLevel.value + "-";
        }
    }

    ids_to_remove = [prefix];
    video_id = prefix.split('-')[2];
    if (tempMap && tempMap.length > 0){
        for (i=0 ; i < tempMap.length ; i++){
            tempModules = tempMap[i]['modules'];
            if (tempModules && tempModules.length > 0){
                for (j=0 ; j < tempModules.length ; j++){
                    tempVideos = tempModules[j]['videos'];
                    if (tempVideos && tempVideos.length > 0){
                        for (k=0 ; k < tempVideos.length ; k++){
                            if (tempVideos[k]['id'] == parseInt(video_id)){
                                tempModuleId = tempModules[j]['id'];
                                tempQuiz = tempVideos[k]['quiz'];
                                if (tempQuiz && tempQuiz.length > 0){
                                    for (l=0 ; l < tempQuiz.length ; l++){
                                        ids_to_remove.push("quiz-temp-"+tempQuiz[l]['id']);
                                    }
                                }
                                tempVideos.splice(k,1);
                                tempMap[i]['modules'][j]['videos'] = tempVideos;
                            }
                        }
                    }
                }
            }
        }
    }
    renderTempMap('v',tempModuleId);
    for (i=0 ; i < ids_to_remove.length ; i++){
        $('#'+ids_to_remove[i]).modal('hide');
        document.getElementById(ids_to_remove[i]).remove();
    }

    saving_check();
}

function add_new_quiz(video_id){
    if (document.getElementById('quiz-temp-'+quiz_count)){
        document.getElementById('quiz-temp-'+quiz_count).remove();
    }
    new_quiz = $('#quiz-temp').prop('outerHTML');
    new_quiz = new_quiz.replaceAll("quiz-temp","quiz-temp-"+quiz_count);
    new_quiz = new_quiz.replaceAll("video_id",video_id);
    document.getElementById('admin-add-form').insertAdjacentHTML('beforeend',new_quiz);
    $('#quiz-temp-'+quiz_count+'-answer').select2({
        placeholder: 'Select an Answer'
    });
    $('#quiz-temp-'+quiz_count).modal('show');
}

function confirm_add_quiz(prefix,video_id){
    if (!$('#'+prefix+'-ques').val()){
        window.alert("Please enter a question!");
        return;
    }
    check = true;
    quiz_id = prefix.split('-')[2];
    for (i=0 ; i<tempMap.length ; i++){
        tempModules = tempMap[i]['modules'];
        for (j=0 ; j<tempModules.length ; j++){
            tempVideos = tempModules[j]['videos'];
            for (k=0 ; k<tempVideos.length ; k++){
                tempQuiz = tempVideos[k]['quiz'];
                for (l=0 ; l<tempQuiz.length ; l++){
                    if (tempQuiz[l]['id'] == parseInt(quiz_id)){
                        check = false;
                    }
                }
            }
        }
    }
    if (check){
        for (i=0 ; i < tempMap.length ; i++){
            for (j=0 ; j < tempMap[i]['modules'].length ; j++){
                for (k=0 ; k < tempMap[i]['modules'][j]['videos'].length ; k++){
                    if (tempMap[i]['modules'][j]['videos'][k]['id'] == video_id){
                        tempMap[i]['modules'][j]['videos'][k]['quiz'].push({'id':quiz_count,'title':'Question '+quiz_count});
                    }
                }
            }
        }
        quiz_count += 1;
    }
    $('#'+prefix).modal('hide');
    renderTempMap('q',''+video_id);

    saving_check();
}

function delete_quiz(prefix){
    if (edit_flow == 1){
        delLevel = document.getElementById(prefix+"-id");
        if (delLevel){
            document.getElementById("del-quiz").value = document.getElementById("del-quiz").value + delLevel.value + "-";
        }
    }

    ids_to_remove = [prefix];
    quiz_id = prefix.split('-')[2];
    if (tempMap && tempMap.length > 0){
        for (i=0 ; i < tempMap.length ; i++){
            tempModules = tempMap[i]['modules'];
            if (tempModules && tempModules.length > 0){
                for (j=0 ; j < tempModules.length ; j++){
                    tempVideos = tempModules[j]['videos'];
                    if (tempVideos && tempVideos.length > 0){
                        for (k=0 ; k < tempVideos.length ; k++){
                            tempQuiz = tempVideos[k]['quiz'];
                            if (tempQuiz && tempQuiz.length > 0){
                                for (l=0 ; l < tempQuiz.length ; l++){
                                    if (tempQuiz[l]['id'] == parseInt(quiz_id)){
                                        tempVideoId = tempVideos[k]['id'];
                                        tempQuiz.splice(l,1);
                                        tempMap[i]['modules'][j]['videos'][k]['quiz'] = tempQuiz
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    renderTempMap('q',tempVideoId);
    for (i=0 ; i < ids_to_remove.length ; i++){
        $('#'+ids_to_remove[i]).modal('hide');
        document.getElementById(ids_to_remove[i]).remove();
    }

    saving_check();
}



function add_new_quiz_option(quiz_temp){
    temp_option_text = '<div id="quiz-temp-answer-1"><div class="row"><div class="col-sm-6">';
    temp_option_text += '<input onchange="changeAnswers(\'quiz-temp\')" class="form-control" form="admin-add-form" id="quiz-temp-title1" name="quiz-temp-title1" type="text" placeholder="Text">';
    temp_option_text += '</div><div class="col-sm-6 form-inline">';
    temp_option_text += 'Image <input class="form-control" style="width: 75%;" form="admin-add-form" id="quiz-temp-image1" type="file" name="quiz-temp-image1" accept="image/*">';
    temp_option_text += '&ensp;<i class="text-danger fas fa-trash pointer" title="Remove Quiz Option" onclick="remove_quiz_option(\'quiz-temp-answer-1\')"></i>';
    temp_option_text += '</div></div><hr></div>';

    temp_option_text = temp_option_text.replaceAll("quiz-temp",quiz_temp);

    answer_holder = document.getElementById(quiz_temp+'-answer-holder');
    if (answer_holder.children && answer_holder.children.length > 0){
        new_id = parseInt(answer_holder.children[answer_holder.children.length-1].id.split("-")[4]) + 1;
    }
    else{
        new_id = 1;
    }
    temp_option_text = temp_option_text.replaceAll("answer-1","answer-"+new_id);
    temp_option_text = temp_option_text.replaceAll("title1","title"+new_id);
    temp_option_text = temp_option_text.replaceAll("image1","image"+new_id);

    answer_holder.insertAdjacentHTML('beforeend',temp_option_text);
}

function remove_quiz_option(answer_id){
    if (edit_flow == 1){
        tempAnsId = answer_id.replaceAll("answer-","id")
        delLevel = document.getElementById(tempAnsId);
        if (delLevel){
            document.getElementById("del-opt").value = document.getElementById("del-opt").value + delLevel.value + "-";
        }
    }
    document.getElementById(answer_id).remove();
}

function changeAnswers(quiz_temp){
    answer_holder = document.getElementById(quiz_temp+'-answer-holder');
    if (answer_holder.children && answer_holder.children.length > 0){
        new_id = parseInt(answer_holder.children[answer_holder.children.length-1].id.split("-")[4]) + 1;
        $('#'+quiz_temp+'-answer').find('option').remove();
        newOption = new Option("", "", false, false);
        $('#'+quiz_temp+'-answer').append(newOption);
        for (i=1 ; i<new_id ; i++){
            temp = document.getElementById(quiz_temp+"-title"+i);
            if (temp && temp.value){
                newOption = new Option(temp.value, i, false, false);
                $('#'+quiz_temp+'-answer').append(newOption);
            }
        }
        $('#'+quiz_temp+'-answer').trigger('change');
    }
}

function removeExistingFile(existingFileCb){
    tempFileId = existingFileCb.id + "clear";
    if (existingFileCb.checked){
        document.getElementById(tempFileId).value = "y";
    }
    else{
        document.getElementById(tempFileId).value = "n";
    }
}