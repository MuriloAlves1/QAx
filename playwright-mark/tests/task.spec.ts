import { test } from '@playwright/test';
import { taskModel } from './fixtures/task.model';
import { deleteTaskByHelper, postTask } from './support/helpers'
import { TasksPage } from './support/pages/tasks';
import data from './fixtures/tasks.json'

// import { faker } from '@faker-js/faker';

// test('Deve poder cadastrar uma nova tarefa', async ({page}) => {
//     await page.goto('http://localhost:8080')
//     await page.fill('#newTask', 'Ler um livro de TypeScript')
//     // await page.fill('input["Add new Task"]', 'Ler um livro de TypeScript') -> FORMA DE PEGAR PELO SELETOR, CASO NAO TENHA ID (input[VALOR])
//     // await page.fill('._listInputNewTask_1y0mp_21') -> FORMA DE PEGAR PELA CLASSE, CASO NÃO TENHA ID (CLASSE = USA O PONTO .);

// })




//UTILIZANDO CONSTANTE
// test('Deve poder cadastrar uma nova tarefa', async ({page, request }) => {

//     //Dado que eu tenho uma nova tarefa

    
//     await request.delete('http://localhost:3333/helper/tasks/' + taskName)

//     await request.post('http://localhost:3333/tasks/')

//     // E que estou na página de cadastro
//     await page.goto('http://localhost:8080')

//     //Quando faço o cadastro dessa tarefa
//     const task = page.locator('#newTask')
//     await task.fill(taskName)
//     // await task.fill(faker.lorem.words())
//     const button = page.locator('._listButtonNewTask_1y0mp_40')
//     await button.click()

//     // Então essa tarefa deve ser exibida na lista
//     const target = page.locator('css=.task-item p >> text=' + taskName)
//     await expect(target).toHaveText(taskName)
// })


test('Criar uma tarefa', async ({page, request }) => {

    const task = data.success as taskModel

    const taskPage: TasksPage = new TasksPage(page)
    await taskPage.go()
    await taskPage.create(task)
    await deleteTaskByHelper(request, task.name)

})

test('Nao permitir tarefa duplicando', async ({page, request}) => {
    
    const task = data.duplicate as taskModel

    //Deleta + Cria Task via API
    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    //Acessa página + Cria Tarefa
    const taskPage: TasksPage = new TasksPage(page)
    await taskPage.go()
    await taskPage.create(task)
    await taskPage.shouldHaveText(task.name)
    await taskPage.alertHaveText('Task already exists!')
})


test('Verificar se o campo da tarefa esta preenchido', async ({page}) => {
    
    const task = data.required as taskModel

    const taskPage: TasksPage = new TasksPage(page)

    await taskPage.go()
    await taskPage.create(task)
    await taskPage.validationMessage()
})

test('Deve concluir uma tarefa', async ({page, request}) => {

    const task = data.update as taskModel
    
    //Deleta + Cria tarefa via API
    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    // Aqui estou criando um objeto a partir da classe 
    // pra conseguir acessar suas funções (métodos)
    const taskPage: TasksPage = new TasksPage(page)

    //Entra na página
    await taskPage.go()
    
    //Verifica se a tarefa foi concluída
    await taskPage.toggle(task.name)

    //Verifica se o nome esta com traçado (Pega pelo style CSS)
    await taskPage.shouldBeDone(task.name)
})

test('Deve excluir uma tarefa', async ({page, request}) => {

    const task = data.delete as taskModel
    
    //Deleta + Cria tarefa via API
    await deleteTaskByHelper(request, task.name)
    await postTask(request, task)

    // Aqui estou criando um objeto a partir da classe 
    // pra conseguir acessar suas funções (métodos)
    const taskPage: TasksPage = new TasksPage(page)

    //Entra na página
    await taskPage.go()
    
    //Remove a tarefa
    await taskPage.remove(task.name)

    //Verifica se a tarefa existe ainda
    await taskPage.shouldNotExist(task.name)
})