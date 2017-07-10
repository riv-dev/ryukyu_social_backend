module.exports = {
    local_development: {
        users_service: 'http://ryukyu-users-service:5000',
        user_photos_service: 'http://ryukyu-user-photos-service:5001',
        projects_service: 'http://ryukyu-projects-service:5002',
        tasks_service: 'http://ryukyu-tasks-service:5003'
    },

    remote_development: {
        users_service: 'https://ryukyu-social.cleverword.com/users_service/api',
        user_photos_service: 'https://ryukyu-social.cleverword.com/user_photos_service/api',
        projects_service: 'https://ryukyu-social.cleverword.com/projects_service/api',
        tasks_service: 'https://ryukyu-social.cleverword.com/tasks_service/api'
    },

    production: {
        users_service: 'https://ryukyu-social.cleverword.com/users_service/api',
        user_photos_service: 'https://ryukyu-social.cleverword.com/user_photos_service/api',
        projects_service: 'https://ryukyu-social.cleverword.com/projects_service/api',
        tasks_service: 'https://ryukyu-social.cleverword.com/tasks_service/api'       
    }
}