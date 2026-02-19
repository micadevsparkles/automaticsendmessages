document.getElementById('btnGerar').addEventListener('click', processarContatos);
document.getElementById('btnLimpar').addEventListener('click', () => {
    document.getElementById('inputContatos').value = '';
    document.getElementById('containerBotoes').innerHTML = '';
    document.getElementById('stats').innerText = '';
});

function processarContatos() {
    const rawText = document.getElementById('inputContatos').value;
    const container = document.getElementById('containerBotoes');
    const stats = document.getElementById('stats');
    
    container.innerHTML = ''; // Limpa botões anteriores

    // Mensagem codificada para URL
    const mensagemBase = "Chamada%20Especial%3A%20Outlet%20Natal%20Hair!%20%E2%9C%A8%20%E2%80%8BPreparem%20o%20cora%C3%A7%C3%A3o%20(e%20as%20malas!)%2C%20porque%20o%20primeiro%20outlet%20do%20ano%20est%C3%A1%20chegando!%20A%20Faf%C3%A1%20Medeiros%20Produ%C3%A7%C3%B5es%20convida%20voc%C3%AA%20para%20dois%20dias%20incr%C3%ADveis%20de%20muitas%20novidades%20e%20pre%C3%A7os%20imperd%C3%ADveis.%20%F0%9F%9B%8D%EF%B8%8F%20%E2%80%8Bnos%20%20Dias%2022%20e%2023%20de%20mar%C3%A7o.%20%F0%9F%95%90%20%20Das%2013h%20%C3%A0s%2021h.%20%F0%9F%93%8D%20no%20%20Praia%20Shopping%20%E2%80%93%20Avenida%20Engenheiro%20Roberto%20Freire%2C%20com%20aquele%20acesso%20super%20f%C3%A1cil%20que%20voc%C3%AA%20j%C3%A1%20conhece!%20%20%E2%80%8BVenha%20conferir%20as%20melhores%20ofertas%20em%20um%20ambiente%20maravilho%20%E2%80%8BN%C3%A3o%20perca%20essa%20oportunidade!%20Esperamos%20por%20voc%C3%AAs!%20%F0%9F%92%83%E2%9C%A8%20%E2%80%8B";

    // 1. Remove tudo que não é número
    const apenasNumeros = rawText.replace(/\D/g, '');

    // 2. Identifica grupos de números (Padrão: DDD + Número)
    // Busca sequências de 10 a 11 dígitos
    // Se o usuário colou tudo grudado, tentamos quebrar por blocos de celular
    let contatosEncontrados = [];
    
    // Regex para encontrar números de telefone brasileiros (com ou sem o 9)
    // Tenta pegar sequências de 10 (sem 9) ou 11 (com 9) dígitos
    const regexTelefone = /(?:\d{2})(?:9?\d{8})/g;
    let match;
    
    while ((match = regexTelefone.exec(apenasNumeros)) !== null) {
        let num = match[0];
        
        // Se o número tem 10 dígitos (DDD + 8 dígitos), insere o 9
        if (num.length === 10) {
            num = num.substring(0, 2) + "9" + num.substring(2);
        }
        
        contatosEncontrados.push(num);
    }

    // Remover duplicados
    const contatosUnicos = [...new Set(contatosEncontrados)];

    if (contatosUnicos.length === 0) {
        stats.innerText = "Nenhum número válido encontrado.";
        return;
    }

    stats.innerText = `${contatosUnicos.length} contatos identificados:`;

    // 3. Criar os botões
    contatosUnicos.forEach(tel => {
        const link = document.createElement('a');
        link.href = `https://wa.me/55${tel}?text=${mensagemBase}`;
        link.target = "_blank";
        link.className = "btn-contato";
        link.innerText = `Enviar para ${formatarMascara(tel)}`;
        container.appendChild(link);
    });
}

// Função auxiliar para exibir o número formatado no botão
function formatarMascara(tel) {
    return `(${tel.substring(0,2)}) ${tel.substring(2,7)}-${tel.substring(7)}`;
}
