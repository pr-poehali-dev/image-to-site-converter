import { useState } from "react";
import Icon from "@/components/ui/icon";

const EMAIL_FUNC_URL = "https://functions.poehali.dev/f7c444ad-19dc-4b8e-899c-4e0bf84c9443";

const SAUNA_IMG = "https://cdn.poehali.dev/projects/821d946b-b312-4546-85af-06b1c52d04db/files/47bf194a-f51d-4458-9613-5c5ac7510f10.jpg";
const GRILL_IMG = "https://cdn.poehali.dev/projects/821d946b-b312-4546-85af-06b1c52d04db/files/3780e3f1-d2c7-4609-b849-3e6c6ed5729f.jpg";
const KUPEL_IMG = "https://cdn.poehali.dev/projects/821d946b-b312-4546-85af-06b1c52d04db/files/efc9a954-d5c3-4f33-8415-24a6ac3ebf5f.jpg";

const navLinks = ["Каталог", "Доставка", "Контакты"];

const products = [
  { id: 1, name: "Баня-бочка 3 метра", price: "от 120 000 р.", img: SAUNA_IMG, tag: "Хит", desc: "Классическая форма бочки из кедра. Вместимость 2–4 чел. Быстрый прогрев." },
  { id: 2, name: "Баня-бочка 4 метра", price: "от 159 000 р.", img: SAUNA_IMG, tag: null, desc: "Просторная парная с предбанником. Отличный выбор для семьи." },
  { id: 3, name: "Баня-бочка 6 метров", price: "от 218 000 р.", img: SAUNA_IMG, tag: null, desc: "Большая баня с комнатой отдыха и купелью." },
  { id: 4, name: "Гриль-домик", price: "от 480 000 р.", img: GRILL_IMG, tag: null, desc: "Деревянная беседка-гриль с зоной барбекю и вентиляцией." },
];

const advantages = [
  { icon: "Clock", title: "Доставка 4–6 недель", desc: "Быстрое производство" },
  { icon: "TreePine", title: "Кедр и лиственница", desc: "Натуральное сырьё" },
  { icon: "Shield", title: "Гарантия 3 года", desc: "На все изделия" },
  { icon: "Truck", title: "Доставка по РФ", desc: "До вашего участка" },
  { icon: "Wrench", title: "Монтаж под ключ", desc: "Установим сами" },
  { icon: "Flame", title: "Печь в подарок", desc: "При заказе от 150 000 р." },
];

const faqs = [
  { q: "Из чего делают бани?", a: "Мы используем только натуральные породы дерева — кедр, лиственницу и осину. Древесина проходит камерную сушку и антисептическую обработку, что обеспечивает долгий срок службы." },
  { q: "У кого делать баню?", a: "Мы являемся прямым производителем, без посредников. Это гарантирует лучшее качество по оптимальной цене, а также возможность индивидуальной доработки." },
  { q: "Как выбрать баню?", a: "Ориентируйтесь на количество человек и площадь участка. Для 2–3 человек подойдёт бочка 3 м, для семьи из 4+ — 4–6 м. Наши менеджеры помогут с выбором." },
  { q: "Где посмотреть?", a: "Шоурум находится в Москве. Вы можете приехать и посмотреть все модели вживую. Адрес и время работы уточняйте по телефону 8 800 123-45-47." },
];

const reviews = [
  { name: "Алексей П.", city: "Москва", text: "Заказали баню-бочку 4 метра. Доставили точно в срок, установили за один день. Качество отличное, запах кедра стоит даже через год!", rating: 5 },
  { name: "Марина С.", city: "Санкт-Петербург", text: "Давно мечтала о бане на даче. Ребята помогли с выбором, всё подробно объяснили. Результатом очень довольна!", rating: 5 },
  { name: "Дмитрий К.", city: "Казань", text: "Взяли гриль-домик. Сборка аккуратная, материалы качественные. Теперь летом не вылезаем из него!", rating: 5 },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 text-yellow-400 text-lg">
      {Array.from({ length: count }).map((_, i) => <span key={i}>★</span>)}
    </div>
  );
}

export default function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [calcSize, setCalcSize] = useState(3);
  const [calcOptions, setCalcOptions] = useState<Record<string, boolean>>({
    furnace: false,
    cedar: false,
    sideEntry: false,
    shower: false,
    glassDoor: false,
    extraWindow: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const basePricePerMeter = 35000;
  const optionPrices: Record<string, number> = {
    furnace: 25000,
    cedar: 30000,
    sideEntry: 15000,
    shower: 20000,
    glassDoor: 12000,
    extraWindow: 8000,
  };
  const optionLabels: Record<string, string> = {
    furnace: "Угольно-дровяная печь",
    cedar: "Кедровая вагонка в парной",
    sideEntry: "Боковой вход",
    shower: "Душ",
    glassDoor: "Стеклянная дверь",
    extraWindow: "Дополнительное окно",
  };
  const basePrice = calcSize * basePricePerMeter;
  const optionsTotal = Object.entries(calcOptions).reduce(
    (sum, [key, checked]) => sum + (checked ? optionPrices[key] : 0), 0
  );
  const totalPrice = basePrice + optionsTotal;

  function toggleOption(key: string) {
    setCalcOptions(prev => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(EMAIL_FUNC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone }),
      });
      if (!res.ok) throw new Error("Ошибка отправки");
      setSubmitted(true);
    } catch {
      setError("Не удалось отправить заявку. Попробуйте позвонить по телефону.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>

      {/* HEADER */}
      <header className="sticky top-0 z-50 shadow-sm" style={{ background: "var(--green-dark)" }}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <span className="text-white font-display text-xl font-bold tracking-wide">🌲 БАНИКА</span>
          </div>
          <nav className="hidden md:flex gap-6">
            {navLinks.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-white/80 hover:text-white text-sm font-body transition-colors">
                {l}
              </a>
            ))}
          </nav>
          <a href="tel:88001234547" className="text-white font-display text-base font-semibold tracking-wide hover:opacity-80 transition-opacity">
            8 800 123-45-47
          </a>
        </div>
      </header>

      {/* HERO */}
      <section
        className="relative overflow-hidden py-20 md:py-32"
        style={{
          background: "linear-gradient(135deg, #2d4a14 0%, #3d5520 50%, #5a7a2e 100%)",
        }}
      >
        <div className="absolute inset-0 wood-texture opacity-40" />
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-25"
          style={{
            backgroundImage: `url(${SAUNA_IMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            maskImage: "linear-gradient(to left, rgba(0,0,0,0.9), transparent)",
            WebkitMaskImage: "linear-gradient(to left, rgba(0,0,0,0.9), transparent)",
          }}
        />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="max-w-xl fade-in">
            <h1 className="font-display text-white text-5xl md:text-6xl font-bold leading-tight mb-4">
              Бани-бочки,<br />
              гриль-домики,<br />
              купели
            </h1>
            <p className="text-white/80 text-lg mb-2 font-body">
              на вертлет изнутри полностью, от производителя
            </p>
            <p className="text-green-300 font-body mb-8 text-sm">
              ✓ Сделано в России &nbsp;✓ Гарантия 3 года &nbsp;✓ Доставка по всей РФ
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                className="btn-green text-base"
                onClick={() => document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" })}
              >
                Смотреть каталог
              </button>
              <button
                className="px-6 py-3 rounded-lg border-2 border-white/50 text-white font-semibold font-body transition-all hover:bg-white/10 cursor-pointer text-base"
                onClick={() => document.getElementById("calc")?.scrollIntoView({ behavior: "smooth" })}
              >
                Рассчитать стоимость
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* МЫ ПРОИЗВОДИМ */}
      <section className="py-14" style={{ background: "var(--beige)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="section-title">Мы производим:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: SAUNA_IMG, name: "Бани-бочки", desc: "Из кедра, лиственницы и осины" },
              { img: GRILL_IMG, name: "Гриль-домики", desc: "Беседки с зоной барбекю" },
              { img: KUPEL_IMG, name: "Купели", desc: "Деревянные и пластиковые" },
            ].map((item) => (
              <div key={item.name} className="card-product text-center">
                <div className="h-48 overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-xl font-semibold mb-1" style={{ color: "var(--brown)" }}>{item.name}</h3>
                  <p className="text-sm text-gray-500 font-body">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА */}
      <section className="py-14" style={{ background: "var(--cream)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="section-title">Преимущества бань-бочек:</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {advantages.map((adv) => (
              <div key={adv.title} className="flex flex-col items-center text-center p-5 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: "var(--beige)" }}>
                  <Icon name={adv.icon} fallback="Star" size={24} style={{ color: "var(--green)" }} />
                </div>
                <p className="font-display font-semibold text-sm mb-1" style={{ color: "var(--brown)" }}>{adv.title}</p>
                <p className="text-xs text-gray-500 font-body">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КАТАЛОГ */}
      <section id="catalog" className="py-14" style={{ background: "var(--beige)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="section-title">Каталог продукции</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((p) => (
              <div key={p.id} className="card-product flex flex-col md:flex-row">
                <div className="relative md:w-52 h-44 md:h-auto flex-shrink-0 overflow-hidden">
                  {p.tag && (
                    <span className="absolute top-3 left-3 z-10 text-xs font-semibold text-white px-2 py-1 rounded-full" style={{ background: "var(--orange)" }}>
                      {p.tag}
                    </span>
                  )}
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-display text-xl font-semibold mb-2" style={{ color: "var(--brown)" }}>{p.name}</h3>
                    <p className="text-sm text-gray-500 font-body mb-3">{p.desc}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xl font-bold" style={{ color: "var(--green)" }}>{p.price}</span>
                    <button className="btn-green text-sm py-2 px-4">Заказать</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* АКЦИЯ */}
      <section className="py-12" style={{ background: "var(--brown)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block bg-white/10 text-white/80 text-xs font-body px-3 py-1 rounded-full mb-4 tracking-widest uppercase">
            Акция
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            Только до 15 октября скидка 5% на всё!
          </h2>
          <p className="text-white/70 font-body mb-6">Успейте заказать по выгодной цене</p>
          <button
            className="btn-green text-base px-10 py-4"
            style={{ background: "var(--green-light)" }}
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Получить скидку
          </button>
        </div>
      </section>

      {/* КАЛЬКУЛЯТОР */}
      <section id="calc" className="py-14" style={{ background: "var(--cream)" }}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="section-title">Калькулятор стоимости</h2>
          <p className="text-center text-gray-500 font-body mb-8">Выберите длину и опции — стоимость рассчитается автоматически</p>
          <div className="bg-white rounded-2xl shadow-md p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <label className="block font-body font-semibold mb-3" style={{ color: "var(--brown)" }}>
                  Длина бани: <span style={{ color: "var(--green)" }}>{calcSize} м</span>
                </label>
                <input
                  type="range"
                  min={3}
                  max={9}
                  step={1}
                  value={calcSize}
                  onChange={e => setCalcSize(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer mb-1"
                  style={{ accentColor: "var(--green)" }}
                />
                <div className="flex justify-between text-xs font-body text-gray-400 mt-1 mb-6">
                  {[3,4,5,6,7,8,9].map(n => <span key={n}>{n} м</span>)}
                </div>

                <label className="block font-body font-semibold mb-3" style={{ color: "var(--brown)" }}>Дополнительные опции</label>
                <div className="flex flex-col gap-3">
                  {Object.keys(calcOptions).map(key => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={calcOptions[key]}
                        onChange={() => toggleOption(key)}
                        className="w-5 h-5 rounded cursor-pointer"
                        style={{ accentColor: "var(--green)" }}
                      />
                      <span className="font-body text-sm flex-1" style={{ color: "var(--brown)" }}>
                        {optionLabels[key]}
                      </span>
                      <span className="font-body text-sm font-semibold" style={{ color: "var(--green)" }}>
                        +{optionPrices[key].toLocaleString("ru")} ₽
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="md:w-60 rounded-2xl p-6 text-center sticky top-24" style={{ background: "var(--beige)" }}>
                <p className="text-sm font-body text-gray-500 mb-1">База ({calcSize} м)</p>
                <p className="font-display text-xl font-bold mb-2" style={{ color: "var(--brown)" }}>
                  {basePrice.toLocaleString("ru")} ₽
                </p>
                {optionsTotal > 0 && (
                  <>
                    <p className="text-sm font-body text-gray-500 mb-1">Опции</p>
                    <p className="font-display text-xl font-semibold mb-2" style={{ color: "var(--green)" }}>
                      +{optionsTotal.toLocaleString("ru")} ₽
                    </p>
                  </>
                )}
                <div className="border-t pt-4 mt-2" style={{ borderColor: "var(--beige-dark)" }}>
                  <p className="text-xs text-gray-400 font-body mb-1">Итого</p>
                  <p className="font-display text-3xl font-bold" style={{ color: "var(--brown)" }}>
                    {totalPrice.toLocaleString("ru")} ₽
                  </p>
                </div>
                <button
                  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                  className="btn-green mt-5 w-full text-sm px-4"
                >
                  Заказать баню
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14" style={{ background: "var(--beige)" }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="section-title">Часто задаваемые вопросы</h2>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center font-body font-semibold cursor-pointer"
                  style={{ color: "var(--brown)" }}
                >
                  <span>{faq.q}</span>
                  <Icon name={openFaq === i ? "ChevronUp" : "ChevronDown"} size={20} style={{ color: "var(--green)", flexShrink: 0 }} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-500 font-body text-sm leading-relaxed border-t fade-in" style={{ borderColor: "var(--beige-dark)" }}>
                    <p className="pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ГАЛЕРЕЯ */}
      <section className="py-14" style={{ background: "var(--cream)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="section-title">Фото готовых бань</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[SAUNA_IMG, GRILL_IMG, KUPEL_IMG, SAUNA_IMG, GRILL_IMG, KUPEL_IMG].map((img, i) => (
              <div key={i} className="rounded-2xl overflow-hidden aspect-video shadow-md hover:shadow-xl transition-shadow cursor-pointer group">
                <img src={img} alt={`Фото ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ОТЗЫВЫ */}
      <section className="py-14" style={{ background: "var(--beige)" }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="section-title">Отзывы клиентов</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <StarRating count={rev.rating} />
                <p className="text-gray-600 font-body text-sm mt-3 mb-4 leading-relaxed">"{rev.text}"</p>
                <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: "var(--beige-dark)" }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold font-display" style={{ background: "var(--green)" }}>
                    {rev.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm font-body" style={{ color: "var(--brown)" }}>{rev.name}</p>
                    <p className="text-xs text-gray-400 font-body">{rev.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ФОРМА */}
      <section id="contact" className="py-16" style={{ background: "linear-gradient(135deg, #3d5520 0%, #5a7a2e 100%)" }}>
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">Остались вопросы?</h2>
          <p className="text-white/70 font-body mb-8">Мы рады вам помочь, оставьте свои контакты</p>
          {submitted ? (
            <div className="bg-white/10 rounded-2xl p-8 text-white">
              <div className="flex justify-center mb-3">
                <Icon name="CheckCircle" size={48} />
              </div>
              <p className="font-display text-xl font-semibold">Спасибо! Мы свяжемся с вами в ближайшее время.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Ваше имя"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl px-5 py-3 font-body text-base text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/60 transition-all"
                style={{ background: "rgba(255,255,255,0.1)" }}
              />
              <input
                type="tel"
                placeholder="Ваш телефон"
                required
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl px-5 py-3 font-body text-base text-white placeholder-white/50 border border-white/20 focus:outline-none focus:border-white/60 transition-all"
                style={{ background: "rgba(255,255,255,0.1)" }}
              />
              {error && (
                <p className="text-red-300 text-sm font-body">{error}</p>
              )}
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-body font-bold text-base text-white transition-all hover:opacity-90 cursor-pointer disabled:opacity-60" style={{ background: "var(--orange)" }}>
                {loading ? "Отправляем..." : "Перезвоните мне"}
              </button>
              <p className="text-white/40 text-xs font-body">Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности</p>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "var(--brown)" }} className="py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <span className="font-display text-xl font-bold text-white">🌲 БАНИКА</span>
              <p className="text-white/50 text-sm font-body mt-2">Производство деревянных бань, гриль-домиков и купелей с 2010 года</p>
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-white/70 mb-3 tracking-widest uppercase">Навигация</p>
              {navLinks.map(l => (
                <a key={l} href="#" className="block text-white/50 hover:text-white text-sm font-body mb-1 transition-colors">{l}</a>
              ))}
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-white/70 mb-3 tracking-widest uppercase">Контакты</p>
              <a href="tel:88001234547" className="text-white font-display text-lg font-semibold hover:opacity-80 transition-opacity block">8 800 123-45-47</a>
              <p className="text-white/50 text-sm font-body mt-1">Бесплатно по России</p>
              <p className="text-white/50 text-sm font-body mt-2">Пн–Вс: 9:00 – 21:00</p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-white/30 text-xs font-body">© 2024 Баника. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOAT */}
      <a
        href="https://wa.me/77001234567"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform"
        style={{ background: "#25D366" }}
        aria-label="Написать в WhatsApp"
      >
        <svg width="30" height="30" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.655 4.83 1.8 6.858L2 30l7.338-1.775A13.94 13.94 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2z" fill="white"/>
          <path d="M23.5 20.07c-.32-.16-1.9-.937-2.194-1.044-.295-.107-.51-.16-.724.16-.215.32-.83 1.044-1.018 1.258-.187.215-.374.24-.694.08-.32-.16-1.35-.498-2.572-1.587-.95-.848-1.592-1.894-1.779-2.214-.187-.32-.02-.493.14-.652.145-.143.32-.374.48-.56.16-.188.214-.32.32-.535.107-.214.054-.4-.026-.56-.08-.16-.724-1.746-.99-2.39-.262-.63-.527-.544-.724-.554l-.617-.01c-.214 0-.56.08-.854.4-.294.32-1.124 1.098-1.124 2.678s1.151 3.107 1.311 3.321c.16.214 2.266 3.46 5.49 4.851.767.33 1.367.528 1.833.676.77.244 1.471.21 2.025.127.617-.092 1.9-.777 2.168-1.527.267-.75.267-1.393.187-1.527-.08-.133-.294-.213-.614-.373z" fill="#25D366"/>
        </svg>
      </a>

    </div>
  );
}