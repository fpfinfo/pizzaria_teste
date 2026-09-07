import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center mb-12">
          <div className="text-7xl mb-4 animate-bounce">🍕</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-3">
            Pizzaria <span className="text-orange-500">Bella Massa</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            As melhores pizzas da cidade, feitas com amor e ingredientes frescos!
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
            💵 Pagamento somente em dinheiro
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl w-full">
          {/* Customer */}
          <Link
            to="/cliente"
            className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl p-8 text-center transition-all transform hover:-translate-y-2 border border-gray-100 hover:border-orange-200"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🛒</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Fazer Pedido</h2>
            <p className="text-sm text-gray-500">
              Veja o cardápio e faça seu pedido online
            </p>
            <div className="mt-4 text-orange-500 font-semibold text-sm group-hover:text-orange-600">
              Acessar →
            </div>
          </Link>

          {/* Tracking */}
          <Link
            to="/rastrear"
            className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl p-8 text-center transition-all transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📍</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Rastrear Pedido</h2>
            <p className="text-sm text-gray-500">
              Acompanhe o status do seu pedido em tempo real
            </p>
            <div className="mt-4 text-blue-500 font-semibold text-sm group-hover:text-blue-600">
              Rastrear →
            </div>
          </Link>

          {/* Kitchen */}
          <Link
            to="/cozinha"
            className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl p-8 text-center transition-all transform hover:-translate-y-2 border border-gray-100 hover:border-gray-300"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">👨‍🍳</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Cozinha</h2>
            <p className="text-sm text-gray-500">
              Painel de controle para a equipe da cozinha
            </p>
            <div className="mt-4 text-gray-500 font-semibold text-sm group-hover:text-gray-700">
              Acessar →
            </div>
          </Link>

          {/* Admin */}
          <Link
            to="/admin"
            className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl p-8 text-center transition-all transform hover:-translate-y-2 border border-gray-100 hover:border-purple-200"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">⚙️</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Administração</h2>
            <p className="text-sm text-gray-500">
              Gerencie produtos, preços e cardápio
            </p>
            <div className="mt-4 text-purple-500 font-semibold text-sm group-hover:text-purple-600">
              Gerenciar →
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 max-w-4xl w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FeatureCard icon="🍕" text="13 sabores" />
            <FeatureCard icon="🥤" text="Bebidas geladas" />
            <FeatureCard icon="🧀" text="Bordas recheadas" />
            <FeatureCard icon="🎟️" text="Cupons de desconto" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500">
        <p>© 2024 Pizzaria Bella Massa • Feito com ❤️ e muita mussarela</p>
        <p className="mt-1 text-xs text-gray-400">
          🕐 Aberto todos os dias das 18h às 23h • 📞 (11) 99999-9999
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 text-center shadow-sm border border-gray-100">
      <span className="text-2xl">{icon}</span>
      <p className="text-xs font-medium text-gray-600 mt-1">{text}</p>
    </div>
  );
}
