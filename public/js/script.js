document.addEventListener('DOMContentLoaded', function(){

    const allButtons = document.querySelectorAll('.searchBtn');
    const searchBar = document.querySelector('.searchBar');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');

    for (var i = 0; i < allButtons.length; i++) {

        allButtons[i].addEventListener('click', function() {
            searchBar.style.visibility = 'visible';
            searchBar.classList.add('open');
            this.setAttribute('aria-expanded', 'true');
            searchInput.focus();

        });
    }

        searchClose.addEventListener('click', function() {
            searchBar.style.visibility = 'hidden';
            searchBar.classList.remove('open');
            this.setAttribute('aria-expanded', 'false');
            
        });


})



//Codigo para limpar histórico de login
document.addEventListener('DOMContentLoaded', function () {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Armazenar os valores iniciais dos campos de entrada
    let initialUsernameValue = usernameInput.value;
    let initialPasswordValue = passwordInput.value;

    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            // Verificar se a navegação foi feita através do histórico do navegador
            // Se sim, limpar os campos de entrada
            if (window.performance && window.performance.navigation.type === 2) {
                usernameInput.value = initialUsernameValue;
                passwordInput.value = initialPasswordValue;
            }
        }
    });
});
