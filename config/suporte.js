const item = document.querySelector('.menu-item-11')
const item2 = document.querySelector('.menu-item-14')
const divConfig = document.querySelector('.div-config')

async function getUser() {

    const getUserApi = 'http://localhost:3000/getUsuario';

    try {
        const response = await fetch(getUserApi, {
            method: 'GET',
            headers: {
                'x-api-key': 'segredo123',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error);
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            console.log('Nenhum usuário encontrado. Definindo login padrão');
            senhaCodificada = 'ZmdsbWRhMTk2OQ==';
            usuaroiCod = 'adm';

            item.style.zIndex = '999999';
            item2.style.zIndex = '999999';
            divConfig.style.display = 'flex';  
            alertMsg('Usuário não cadastrado. Cadastre para liberar o uso do sistema.','info',5000);
        } else {
            senhaCodificada = data[0].senha || "";
            usuaroiCod = data[0].usuario || "";
            console.log('Usuário obtido com sucesso:', data);
            divConfig.style.display = 'nome'; // ← mostra se usuário foi encontrado
        }


    } catch (error) {
        console.error('Erro ao obter usuário:', error.message);
        alertMsg(error.message, 'error', 4000);
    }
}

divConfig.addEventListener('click', () => {
     alertMsg('Usuário não cadastrado. Cadastre para liberar o uso do sistema.','info',5000);
})

getUser()


