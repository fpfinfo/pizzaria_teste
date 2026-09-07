import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-yellow-500 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <span className="text-8xl block mb-4 animate-bounce">🍕</span>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-2 drop-shadow-lg">
            Bella Massa
          </h1>
          <p className="text-xl text-white/90 font-medium">
            Pizzaria Artesanal
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/cliente"
            className="group bg-white hover:bg-orange-50 text-orange-600 font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-2">🛒</div>
            <div className="text-lg">Fazer Pedido</div>
            <div className="text-sm text-gray-500 mt-1">Cardápio & Carrinho</div>
          </Link>

          <Link
            to="/cozinha"
            className="group bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="text-4xl mb-2">👨‍🍳</div>
            <div className="text-lg">Tela da Cozinha</div>
            <div className="text-sm text-gray-400 mt-1">Gerenciar Pedidos</div>
          </Link>
        </div>

        <div className="mt-12 bg-white/20 backdrop-blur-sm rounded-2xl p-4 max-w-md mx-auto">
          <p className="text-white font-semibold">💵 Pagamento somente em dinheiro</p>
          <p className="text-white/80 text-sm mt-1">
            Aceitamos apenas pagamento em dinheiro na entrega
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-white/70 text-sm">
          <span>🕐 Seg-Dom: 18h-23h</span>
          <span>📞 (11) 99999-0000</span>
        </div>
      </div>
    </div>
  );
}
