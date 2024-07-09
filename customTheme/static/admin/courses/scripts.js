$(document).ready(function() {
    $('#mySelect').select2({
        placeholder: 'Select a Professor'
    });
    $('#mySelect2').select2({
        placeholder: 'Select a Category'
    });
    renderTempMap();
    initObjects();

    new Sortable(document.getElementById('hierarchy'), {
        animation: 150,
        handle: '.item-header',
        onEnd: function(evt) {
            updateOrder('level');
        }
    });
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

function renderTempMap(){
    totalHtml = "";
    if (tempMap && tempMap.length > 0){
        for (i=0 ; i < tempMap.length ; i++){
            totalHtml += `
                <div class="item-container level" data-id="${tempMap[i]['id']}">
                    <div class="item-header">
                        <span>${tempMap[i]['title']}
                            <button class="minimize-btn" onclick="toggleMinimize('level-${tempMap[i]['id']}')">
                                <i class="fas fa-chevron-down minimize-icon"></i>
                            </button>
                        </span>
                        <span>
                            <i class="text-success fas fa-plus icon" title="Add Module To This Level" onclick="add_new_module('${tempMap[i]['id']}')"></i>
                            <i class="text-info fas fa-edit icon" title="Edit" onclick="$('#level-temp-${tempMap[i]['id']}').modal('show')"></i>
                            <i class="text-danger fas fa-trash icon" title="Delete" onclick="confirmDelete('level', ${tempMap[i]['id']})"></i>
                        </span>
                    </div>
                    <div id="level-${tempMap[i]['id']}" class="minimizable-content sortable-modules">`;

            tempModules = tempMap[i]['modules'];
            if (tempModules && tempModules.length > 0){
                for (j=0 ; j < tempModules.length ; j++){
                    totalHtml += `
                        <div class="item-container module" data-id="${tempModules[j]['id']}">
                            <div class="item-header">
                                <span>${tempModules[j]['title']}
                                    <button class="minimize-btn" onclick="toggleMinimize('module-${tempModules[j]['id']}')">
                                        <i class="fas fa-chevron-down minimize-icon"></i>
                                    </button>
                                </span>
                                <span>
                                    <i class="text-success fas fa-plus icon" title="Add Video To This Module" onclick="add_new_video('${tempModules[j]['id']}')"></i>
                                    <i class="text-info fas fa-edit icon" title="Edit" onclick="$('#module-temp-${tempModules[j]['id']}').modal('show')"></i>
                                    <i class="text-danger fas fa-trash icon" title="Delete" onclick="confirmDelete('module', ${tempModules[j]['id']})"></i>
                                </span>
                            </div>
                            <div id="module-${tempModules[j]['id']}" class="minimizable-content sortable-videos">`;

                    tempVideos = tempModules[j]['videos'];
                    if (tempVideos && tempVideos.length > 0){
                        for (k=0 ; k < tempVideos.length ; k++){
                            totalHtml += `
                                <div class="item-container video" data-id="${tempVideos[k]['id']}">
                                    <div class="item-header">
                                        <span>${tempVideos[k]['title']}
                                            <button class="minimize-btn" onclick="toggleMinimize('video-${tempVideos[k]['id']}')">
                                                <i class="fas fa-chevron-down minimize-icon"></i>
                                            </button>
                                        </span>
                                        <span>
                                            <i class="text-success fas fa-plus icon" title="Add Quiz To This Video" onclick="add_new_quiz('${tempVideos[k]['id']}')"></i>
                                            <i class="text-info fas fa-edit icon" title="Edit" onclick="$('#video-temp-${tempVideos[k]['id']}').modal('show')"></i>
                                            <i class="text-danger fas fa-trash icon" title="Delete" onclick="confirmDelete('video', ${tempVideos[k]['id']})"></i>
                                        </span>
                                    </div>
                                    <div id="video-${tempVideos[k]['id']}" class="minimizable-content sortable-quizzes">`;

                            tempQuiz = tempVideos[k]['quiz'];
                            if (tempQuiz && tempQuiz.length > 0){
                                for (l=0 ; l < tempQuiz.length ; l++){
                                    totalHtml += `
                                        <div class="item-container quiz" data-id="${tempQuiz[l]['id']}">
                                            <div class="item-header">
                                                <span>${tempQuiz[l]['title']}</span>
                                                <span>
                                                    <i class="text-info fas fa-edit icon" title="Edit" onclick="$('#quiz-temp-${tempQuiz[l]['id']}').modal('show')"></i>
                                                    <i class="text-danger fas fa-trash icon" title="Delete" onclick="confirmDelete('quiz', ${tempQuiz[l]['id']})"></i>
                                                </span>
                                            </div>
                                        </div>`;
                                }
                            }

                            totalHtml += `</div></div>`;
                        }
                    }

                    totalHtml += `</div></div>`;
                }
            }

            totalHtml += `</div></div>`;
        }
    }
    document.getElementById('hierarchy').innerHTML = totalHtml;

    // Initialize SortableJS for modules, videos, and quizzes
    document.querySelectorAll('.sortable-modules').forEach(function(el) {
        new Sortable(el, {
            animation: 150,
            handle: '.item-header',
            onEnd: function(evt) {
                updateOrder('module', evt.target.closest('.item-container.level').dataset.id);
            }
        });
    });

    document.querySelectorAll('.sortable-videos').forEach(function(el) {
        new Sortable(el, {
            animation: 150,
            handle: '.item-header',
            onEnd: function(evt) {
                updateOrder('video', evt.target.closest('.item-container.module').dataset.id);
            }
        });
    });

    document.querySelectorAll('.sortable-quizzes').forEach(function(el) {
        new Sortable(el, {
            animation: 150,
            handle: '.item-header',
            onEnd: function(evt) {
                updateOrder('quiz', evt.target.closest('.item-container.video').dataset.id);
            }
        });
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
    renderTempMap();
}

function confirmDelete(type, id) {
    if (confirm("Are you sure you want to delete this " + type + "?")) {
        if (type === 'level') {
            delete_level(id);
        } else if (type === 'module') {
            delete_module(id);
        } else if (type === 'video') {
            delete_video(id);
        } else if (type === 'quiz') {
            delete_quiz(id);
        }
    }
}

function delete_level(level_id){
    for (i=0 ; i<tempMap.length ; i++){
        if (tempMap[i]['id'] == level_id){
            tempMap.splice(i, 1);
            break;
        }
    }
    renderTempMap();
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
    renderTempMap();
}

function delete_module(module_id){
    for (i=0 ; i<tempMap.length ; i++){
        tempModules = tempMap[i]['modules'];
        for (j=0 ; j<tempModules.length ; j++){
            if (tempModules[j]['id'] == module_id){
                tempModules.splice(j, 1);
                break;
            }
        }
    }
    renderTempMap();
}

function add_new_video(module_id){
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
    ClassicEditor.create(document.querySelector('#video-temp-'+video_count+'-summary'));
    ClassicEditor.create(document.querySelector('#video-temp-'+video_count+'-notes'));
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
    renderTempMap();
}

function delete_video(video_id){
    for (i=0 ; i<tempMap.length ; i++){
        tempModules = tempMap[i]['modules'];
        for (j=0 ; j<tempModules.length ; j++){
            tempVideos = tempModules[j]['videos'];
            for (k=0 ; k<tempVideos.length ; k++){
                if (tempVideos[k]['id'] == video_id){
                    tempVideos.splice(k, 1);
                    break;
                }
            }
        }
    }
    renderTempMap();
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
        window.alert("Please enter a quiz number!");
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
    renderTempMap();
}

function delete_quiz(quiz_id){
    for (i=0 ; i<tempMap.length ; i++){
        tempModules = tempMap[i]['modules'];
        for (j=0 ; j<tempModules.length ; j++){
            tempVideos = tempModules[j]['videos'];
            for (k=0 ; k<tempVideos.length ; k++){
                tempQuiz = tempVideos[k]['quiz'];
                for (l=0 ; l<tempQuiz.length ; l++){
                    if (tempQuiz[l]['id'] == quiz_id){
                        tempQuiz.splice(l, 1);
                        break;
                    }
                }
            }
        }
    }
    renderTempMap();
}

function add_new_quiz_option(quiz_temp){
    temp_option_text = '<div id="quiz-temp-answer-1"><div class="row"><div class="col-sm-6">';
    temp_option_text += '<input onchange="changeAnswers(\'quiz-temp\')" class="form-control" form="admin-add-form" id="quiz-temp-title1" name="quiz-temp-title1" type="text" placeholder="Text">';
    temp_option_text += '</div><div class="col-sm-6 form-inline">';
    temp_option_text += 'Image <input class="form-control" style="width: 75%;" form="admin-add-form" id="quiz-temp-image1" type="file" name="quiz-temp-image1" accept="image/*">';
    temp_option_text += '&ensp;<i class="text-danger fas fa-trash" title="Remove Quiz Option" style="cursor: pointer;" onclick="remove_quiz_option(\'quiz-temp-answer-1\')"></i>';
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
        tempAnsId = answer_id.replaceAll("answer","id")
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

function updateOrder(type, parentId) {
    const parentElement = parentId ? document.querySelector(`[data-id="${parentId}"] .sortable-${type}s`) : document.querySelector('.sortable-levels');
    const items = parentElement.querySelectorAll(`.item-container.${type}`);
    items.forEach((item, index) => {
        const itemId = item.dataset.id;
        if (type === 'level') {
            const level = tempMap.find(l => l.id == itemId);
            level.order = index;
        } else if (type === 'module') {
            const level = tempMap.find(l => l.id == parentId);
            const module = level.modules.find(m => m.id == itemId);
            module.order = index;
        } else if (type === 'video') {
            const level = tempMap.find(l => l.id == parentId.split('-')[0]);
            const module = level.modules.find(m => m.id == parentId);
            const video = module.videos.find(v => v.id == itemId);
            video.order = index;
        } else if (type === 'quiz') {
            const level = tempMap.find(l => l.id == parentId.split('-')[0]);
            const module = level.modules.find(m => m.id == parentId.split('-')[1]);
            const video = module.videos.find(v => v.id == parentId);
            const quiz = video.quiz.find(q => q.id == itemId);
            quiz.order = index;
        }
    });
}

function toggleMinimize(id) {
    const element = document.getElementById(id);
    const icon = element.previousElementSibling.querySelector('.minimize-icon');
    if (element.style.display === "none") {
        element.style.display = "block";
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-chevron-down');
    } else {
        element.style.display = "none";
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-right');
    }
}
