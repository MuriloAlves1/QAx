import { Page, Locator, expect } from '@playwright/test';
import { taskModel } from '../../../fixtures/task.model';

export class TasksPage {
    readonly page: Page
    readonly inputTaskName: Locator

    constructor(page: Page) {
        this.page = page
        this.inputTaskName = page.locator('input[class*=InputNewTask]')
    }
    //Acessa Página
    async go() {
        await this.page.goto('http://localhost:8080')
    }

    //Cadastra tarefa
    async create(task:taskModel) {
        await this.inputTaskName.fill(task.name)
        await this.page.locator('._listButtonNewTask_1y0mp_40').click()
    }

    //Verifica se existe essa tarefa
    async shouldHaveText(taskName:string){
        const target = this.page.locator(`css =.task-item p >> text=${taskName}`)
        await expect(target).toBeVisible()
    }

    //Alerta se ja tem tarefa criada com esse nome
    async alertHaveText(text: string) {
            const target = this.page.locator('.swal2-html-container')
            await expect(target).toHaveText(text)
    }

    //Valida caso ao tentar criar uma tarefa sem conteúdo
    async validationMessage(){
    const validationMessage = await  this.inputTaskName.evaluate( e => (e as HTMLInputElement).validationMessage)
    expect(validationMessage).toEqual('This is a required field')
    }

    //
    async toggle(taskName: string){ 
        const target = this.page.locator(`xpath=//p[text()='${taskName}']/..//button[contains(@class, 'Toggle')]`)
        await target.click()
    }

    async shouldBeDone(taskName: string){
        const target = this.page.getByText(taskName)
        await expect(target).toHaveCSS('text-decoration-line', 'line-through')
    }

    async remove(taskName: string){
        const target = this.page.locator(`xpath=//p[text()='${taskName}']/..//button[contains(@class, 'Delete')]`)
        await target.click()
    }

    async shouldNotExist(taskName: string){
        const target = this.page.locator(`css =.task-item p >> text=${taskName}`)
        await expect(target).not.toBeVisible()
    }
}

