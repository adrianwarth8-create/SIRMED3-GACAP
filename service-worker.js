const CACHE_NAME = "sirmed-v1";

const ARQUIVOS = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./firebase.js",
    "./login.js",
    "./permissoes.js",
    "./pacientes.js",
    "./profissionais.js",
    "./consultas.js",
    "./historico.js",
    "./prontuarios.js",
    "./triagem.js",
    "./financeiro.js",
    "./dashboard.js",
    "./relatorios.js",
    "./utils.js",
    "./manifest.json"
];

self.addEventListener(
    "install",
    (event) => {

        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(
                    (cache) =>
                        cache.addAll(ARQUIVOS)
                )

        );

        self.skipWaiting();

    }
);


self.addEventListener(
    "activate",
    (event) => {

        event.waitUntil(

            caches
                .keys()
                .then(
                    (nomes) =>

                        Promise.all(

                            nomes.map(
                                (nome) => {

                                    if (
                                        nome !== CACHE_NAME
                                    ) {

                                        return caches.delete(nome);

                                    }

                                }
                            )

                        )

                )

        );

        self.clients.claim();

    }
);


self.addEventListener(
    "fetch",
    (event) => {

        event.respondWith(

            caches
                .match(event.request)
                .then(
                    (resposta) =>

                        resposta
                        ||
                        fetch(event.request)

                )

        );

    }
);
