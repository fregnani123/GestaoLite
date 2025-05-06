const btnMenu = document.querySelector('.menu-item-12');
const divBackup = document.querySelector('.div-backup');
const exit = document.querySelector('.exit');

// Toggle divBackup display when btnMenu is clicked
btnMenu.addEventListener('click', (e) => {
    e.preventDefault();

    const computedDisplay = getComputedStyle(divBackup).display;

    if (computedDisplay === 'none') { 
        divBackup.style.display = 'block'; 
    } else {
        divBackup.style.display = 'none';  
    }
});

// Hide divBackup when Escape key is pressed
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const computedDisplay = getComputedStyle(divBackup).display;
        if (computedDisplay === 'block') {
            divBackup.style.display = 'none';  // Hide the div
        }
    }
});

// Hide divBackup when Escape key is pressed
exit.addEventListener('click', (e) => {
    e.preventDefault()
        const computedDisplay = getComputedStyle(divBackup).display;
        if (computedDisplay === 'block') {
            divBackup.style.display = 'none';  // Hide the div
        }
});

const { ipcRenderer } = require('electron');

const btnBackup = document.querySelector('#backupBtn'); // Botão de backup

btnBackup.addEventListener('click', async () => {
    const response = await ipcRenderer.invoke('perform-backup');
    if (response.success) {
        alert(response.message); // Exibe mensagem de sucesso
    } else {
        alert(`Erro: ${response.message}`); // Exibe mensagem de erro
    }
});

