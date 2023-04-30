class Job{
    constructor(name){
        this.name = name;
        this.role = [];

}
addRole(name,role) {
    this.role.push(new Role(name, role));
}

}

class Role {
    constructor(name, role){
        this.name = name;
        this.role = role;
    }
}

class JobService {
    static url = "https://64493af5e7eb3378ca43680a.mockapi.io/week12/jobs";
    
    static getAllJobs() {
        return $.get(this.url);
    }
    static getJob(id){
        return $.get(this.url + `/${id}`);
    }
    static createJob(job) {
        return $.post(this.url, job);
    }
    static updateJob(job) {
        return $.ajax({
            url: this.url + `/${job._id}`,
            dataType: 'json',
            data: JSON.stringify(job),
            contentType: 'application/json',
            type: 'PUT'
        });
    }
    static deleteJob(id){
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
    
        });
    }
}

class DOMManager {
    static jobs;

    static getAllJobs() {
        JobService.getAllJobs().then(jobs => this.render(jobs));
    }

    static createJob(name) {
        JobService.createJob (new Job(name))
        .then(() => {
            return JobService.getAllJobs();
        })
        .then((jobs) => this.render(jobs));
    }

    static deleteJob(id){
        JobService.deleteJob(id)
        .then(() => {
            return JobService.getAllJobs();
        })
        .then((jobs) => this.render(jobs));
    }

    static addRole(id){
        for (let job of this.jobs){
            if (job._id == id) {
            //if(this.jobs._id == id){
                job.addRole($(`#${job._id}-role-name`).val(), $(`#${job._id}-role-area`).val());
               // job.roles.push(new Role($(`#${job._id}-role-name`).val(), $(`#${job._id}-role-area`).val()));
                JobService.updateJob(job) 
                 .then(() => {
                    return JobService.getAllJobs();
                 })
                 .then((jobs) => this.render(jobs));
            }
        }
    }

    static deleteRole(jobId, roleId){
        for(let job of this.jobs){
            if(job._id == jobId){
                for(let role of job.roles){
                    if(role._id == roleId){
                        job.roles.splice(job.roles.indexOf(role), 1);
                        JobService.updateJob(job)
                        .then(() => {
                            return JobService.getAllJobs();
                        })
                        .then((jobs) => this.render(jobs));
                    }
                }
            }
        }
    }

    static render(jobs) {
        this.jobs = jobs;
        $('#app').empty();
        for (let job of jobs) {
            $('#app').prepend(
                `<div id="${job._id}" class ="card">
                    <div class="card-header">
                    <h2>${job.name}</h2>
                    <button class= "btn btn-danger" onclick="DOMManager.deleteJob('${job._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                  <input type="text" id="${job._id}-role-name" class="form-control" placeholder="Role Name">  
                                </div>
                                <div class="col-sm">
                                  <input type="text" id="${job._id}-job-name" class="form-control" placeholder="Job Role">  
                                </div>
                            </div>
                            <button id="${job._id}-new-role" onclick="DOMManager.addRole('${job._id}')" class="btn btn-primary form-control"> Add </button>
                        </div>    
                    </div>
                </div><br>`

            );
            for(let role of job.roles){
                $(`#${job._id}`).find('.card-body').append(
                    `<p>
                        <span id="name-${role._id}"><strong>Name: </strong> ${role.name}</span>
                        <span id="role-${role._id}"><strong>Role: </strong> ${role.role}</span>
                        <button class="btn btn-danger" onclick="DOMManager.deleteRole('${job._id}', '${role._id}')">Delete Role</button>`
                );
            }
        }
    }
}

$('#create-new-job').click(() => {
    DOMManager.createJob($('#new-job-name').val());
    $('#new-job-name').val('');
});

DOMManager.getAllJobs();