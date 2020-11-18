const formataData = (data) => {
    let novaData = new Date(data)
    return novaData.getDate() + '/' + (novaData.getMonth() + 1) + '/' + novaData.getFullYear()
}

const cursosList = {
    '_540405_1': 'Probabilidade e Estatística',
    '_541803_1': 'Tópicos de Matemática',
    '_540990_1': 'Arquitetura de Computadores'
  }


let tarefa = (id, title, exercice, dueDate) => ({
    id: id,
    curseTitle: typeof cursosList[title] != 'undefined' ? cursosList[title] : title ,
    exercice: exercice,
    dueDate: formataData(dueDate)
})

let forum = (id, title, exercice, dueDate) => ({
    id: id,
    curseTitle: typeof cursosList[title] != 'undefined' ? cursosList[title] : title ,
    exercice: exercice,
    dueDate: formataData(dueDate)
})

module.exports = {
    tarefa: tarefa,
    forum: forum,
    formataData: formataData
}