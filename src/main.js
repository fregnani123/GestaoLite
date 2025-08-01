const { app, ipcMain, BrowserWindow, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const startServer = require(path.join(__dirname, '../Server/server'));

// Manipulador para obter o caminho do APPDATA
ipcMain.handle('get-app-data-path', () => {
    return process.env.APPDATA; // Retorna o caminho APPDATA para o renderer
});

// Solicitar o caminho APPDATA
const appDataPath = process.env.APPDATA; 
const sqliteFilePath = path.join(appDataPath, 'electronmysql', 'db', 'gestaolite.db');

// Função de backup do banco de dados
function backupDatabase() {
    return dialog.showSaveDialog({
        title: 'Salvar Backup do Banco de Dados',
        defaultPath: 'gestaolite.db',
        filters: [
            { name: 'SQLite Files', extensions: ['sqlite'] },
            { name: 'All Files', extensions: ['*'] }
        ]
    }).then(result => {
        if (!result.canceled) {
            const destinationPath = result.filePath;

            return new Promise((resolve, reject) => {
                fs.copyFile(sqliteFilePath, destinationPath, (err) => {
                    if (err) {
                        console.error('Erro ao realizar o backup:', err);
                        reject(err);
                    } else {
                        console.log('Backup realizado com sucesso:', destinationPath);
                        resolve('Backup realizado com sucesso!');
                    }
                });
            });
        } else {
            return Promise.reject('Backup cancelado pelo usuário.');
        }
    }).catch(err => {
        console.error('Erro ao salvar o backup:', err);
        return Promise.reject(err);
    });
}

// Manipulador para realizar o backup
ipcMain.handle('perform-backup', async () => {
    try {
        const message = await backupDatabase();
        return { success: true, message };
    } catch (error) {
        return { success: false, message: error };
    }
});

let mainWindow;

// Função para criar a janela principal
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false // Dependendo da configuração, isso pode ser necessário
        },
        icon: path.join(__dirname, '../style/img/ico.ico') // Caminho para o ícone
    });

    // Carregar o arquivo HTML
    mainWindow.loadFile(path.join(__dirname, '../public/index.html'));
    mainWindow.maximize();
    // Abre as ferramentas de desenvolvedor (opcional)
     mainWindow.webContents.openDevTools();
}

// Evento quando a aplicação estiver pronta
app.whenReady().then(() => {
    // Remove o menu globalmente
    Menu.setApplicationMenu(null);
    startServer();
    createWindow();
});

// Evento quando todas as janelas forem fechadas
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Evento quando a aplicação é ativada novamente (no macOS)
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Manipulador para imprimir automaticamente
ipcMain.handle('imprimir-venda', () => {
    // Chama a impressão diretamente sem abrir a caixa de diálogo
    mainWindow.webContents.print({
        silent: true,  // Impede a caixa de diálogo de aparecer
        printBackground: true, // Imprime o fundo da página
    }, (success, errorType) => {
        if (success) {
            console.log('Impressão realizada com sucesso!');
        } else {
            console.error('Erro ao realizar a impressão:', errorType);
        }
    });
});

