import Mock from 'mockjs';

Mock.mock('http://173.82.232.228:443/api/template', function() {
    let j = Math.ceil(Math.random() * 10) + 1;
    let t = [];
    for(let i = 0; i < j; i++) {
        t.push(Mock.mock({
            template_display_name: Mock.Random.csentence(1,5),
            template_name:  Mock.Random.word(3,20),
            'task_list|1-8': [
                {
                    task_display_name: Mock.Random.csentence(1,8),
                    task_algo: Mock.Random.csentence(1,8),
                },
                {
                    task_display_name: Mock.Random.csentence(1,8),
                    task_algo: Mock.Random.csentence(1,8),
                },
                {
                    task_display_name: Mock.Random.csentence(1,8),
                    task_algo: Mock.Random.csentence(1,8),
                },
            ]
        }))
    }
    return t;
})
