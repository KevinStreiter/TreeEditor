window.onload = () => {
    getProjects();
};
function getProjects() {
    let url = '/treeEditor/projects';
    fetch(url, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => listProjects(data));
}
function deleteProject(id) {
    let url = '/treeEditor/projects/delete?id=' + id;
    fetch(url, {
        method: 'POST'
    });
}
function listProjects(data) {
    let ul = document.getElementById("projects");
    for (let project of data) {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(project["name"]));
        li.insertAdjacentHTML('beforeend', `<a class="deleteProjectBtn"><i class="fa fa-times"></i></a>`);
        li.setAttribute("id", project["project_id"]);
        ul.appendChild(li);
        li.addEventListener("click", function () {
            openProject(project["project_id"], project["name"], project["width"], project["height"]);
        });
    }
    document.querySelectorAll(".deleteProjectBtn").forEach(item => {
        item.addEventListener('click', initDeleteProject);
    });
}
function initDeleteProject(event) {
    let parent = event.target.parentNode;
    let id = parent.id;
    if (id == "") {
        parent = parent.parentNode;
        id = parent.id;
    }
    deleteProject(id);
    parent.remove();
    event.stopPropagation();
}
function openProject(id, name, width, height) {
    window.location.href = "/treeEditor/project?id=" + id + "&name=" + name + "&width=" + width + "&height=" + height;
}
