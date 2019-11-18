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
function listProjects(data) {
    let ul = document.getElementById("projects");
    for (let project of data) {
        let li = document.createElement("li");
        let span = document.createElement("span");
        li.appendChild(document.createTextNode(project["name"]));
        li.setAttribute("id", project["project_id"]);
        li.appendChild(span);
        ul.appendChild(li);
        li.addEventListener("click", function () {
            openProject(project["project_id"], project["name"]);
        });
    }
}
function openProject(id, name) {
    window.location.href = "/treeEditor/project?id=" + id + "&name=" + name;
}
