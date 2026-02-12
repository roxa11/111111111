const APP_CONFIG = {
    ADMIN_IINS: ["999999999999"],
    WORKER_DIRECTORY: {
        "222222222222": "ТОО Semey Road Service"
    }
};

const App = {
    state: {
        user: null,
        allRows: JSON.parse(localStorage.getItem('city_db')) || [] 
    },

    init: function() {
        this.cacheElements();
        this.bindEvents();
        
        const savedUser = localStorage.getItem('city_user');
        if (savedUser) {
            this.state.user = JSON.parse(savedUser);
            this.enterRoleView();
        }
    },

    cacheElements: function() {
        this.els = {
            loginForm: document.getElementById('login-form'),
            citizenForm: document.getElementById('citizen-form'),
            citizenList: document.getElementById('citizen-list'),
            adminFeed: document.getElementById('admin-feed'),
            userChip: document.getElementById('user-chip'),
            logoutBtn: document.getElementById('btn-logout')
        };
    },

    bindEvents: function() {
        this.els.loginForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        this.els.citizenForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.createRequest();
        });

        this.els.logoutBtn?.addEventListener('click', () => this.logout());
    },

    login: function() {
        const iin = document.getElementById('login-iin').value;
        const name = document.getElementById('login-name').value;
        const role = APP_CONFIG.ADMIN_IINS.includes(iin) ? 'admin' : 'citizen';

        this.state.user = { iin, name, role };
        localStorage.setItem('city_user', JSON.stringify(this.state.user));
        this.enterRoleView();
    },

    logout: function() {
        localStorage.removeItem('city_user');
        location.reload();
    },

    enterRoleView: function() {
        document.getElementById('view-login').classList.add('hidden');
        document.getElementById('view-' + this.state.user.role).classList.remove('hidden');
        this.els.userChip.textContent = this.state.user.name;
        this.els.userChip.classList.remove('hidden');
        this.els.logoutBtn.classList.remove('hidden');
        this.renderActiveView();
    },

    createRequest: function() {
        const newReq = {
            id: Date.now(),
            author: this.state.user.name,
            address: document.getElementById('req-address').value,
            category: document.getElementById('req-category').value,
            description: document.getElementById('req-description').value,
            status: 'new',
            created_at: new Date().toISOString()
        };

        this.state.allRows.push(newReq);
        localStorage.setItem('city_db', JSON.stringify(this.state.allRows));
        this.els.citizenForm.reset();
        this.renderActiveView();
    },

    renderActiveView: function() {
        const list = this.state.user.role === 'admin' ? this.els.adminFeed : this.els.citizenList;
        const data = this.state.user.role === 'admin' 
            ? this.state.allRows 
            : this.state.allRows.filter(r => r.author === this.state.user.name);

        list.innerHTML = data.map(r => `
            <div class="request-card">
                <h4>${r.address}</h4>
                <p>${r.description}</p>
                <span class="badge">${r.status}</span>
            </div>
        `).join('');
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
