<script setup lang="ts">
import { ref } from 'vue'

interface CourseModule {
  title: string
  lessons: string[]
}

interface Course {
  id: number
  color: string
  title: string
  level: string
  levelColor: string
  forWhom: string[]
  description: string
  results: string[]
  modules: CourseModule[]
}

const courses: Course[] = [
  {
    id: 1,
    color: '#22c55e',
    title: 'Adobe Lightroom Classic с нуля: осознанная база',
    level: 'Начальный',
    levelColor: '#22c55e',
    forWhom: [
      'вы только начинаете работать с Lightroom',
      'путаетесь в форматах, каталоге и настройках',
      'обрабатываете «на глаз» и не понимаете, почему результат нестабильный'
    ],
    description: 'Вы разберётесь, как устроено цифровое изображение и логика Lightroom, научитесь правильно импортировать, отбирать, обрабатывать и экспортировать фотографии.',
    results: [
      'понимаете, что происходит с изображением при обработке',
      'уверенно работаете с каталогом',
      'корректно проявляете RAW',
      'получаете чистый, технически правильный результат'
    ],
    modules: [
      {
        title: 'Основы цифрового изображения',
        lessons: [
          'Что такое цифровое изображение и зачем нужна обработка',
          'Растр и вектор: в чём разница и где используется',
          'Форматы изображений: JPG, RAW, TIFF, PNG — что и когда выбирать'
        ]
      },
      {
        title: 'Знакомство с Lightroom',
        lessons: [
          'Lightroom Mobile vs Lightroom Classic: различия и сценарии работы',
          'Подготовка к работе: каталог, структура хранения',
          'Базовые настройки программы (язык, кэш, XMP, JPG+RAW)',
          'Персонализация Lightroom: подпись, рабочее пространство'
        ]
      },
      {
        title: 'Импорт и организация',
        lessons: [
          'Окно Импорт: все варианты и логика работы',
          'Метаданные: что это и зачем они нужны',
          'Практика: импорт серии с шаблоном метаданных'
        ]
      },
      {
        title: 'Library — навигация и отбор',
        lessons: [
          'Интерфейс модуля Library',
          'Отбор и сортировка изображений',
          'Фильтры, флаги, рейтинги',
          'Основы каталогизации'
        ]
      },
      {
        title: 'Базовая обработка',
        lessons: [
          'Develop: интерфейс и логика',
          'Гистограмма: как читать и использовать',
          'RAW-конвертация и профили',
          'Тональные ползунки: экспозиция и контраст',
          'Баланс белого: методы настройки'
        ]
      },
      {
        title: 'Экспорт',
        lessons: [
          'Экспорт: настройки и логика',
          'Пресеты экспорта для веба и печати',
          'Итоговая практика'
        ]
      }
    ]
  },
  {
    id: 2,
    color: '#eab308',
    title: 'Lightroom Classic: цвет, тон и стабильный результат',
    level: 'Средний',
    levelColor: '#eab308',
    forWhom: [
      'вы уже работаете в Lightroom',
      'хотите стабильный цвет и контраст',
      'не понимаете, почему одинаковые кадры обрабатываются по-разному'
    ],
    description: 'Вы научитесь анализировать изображение, осознанно работать с тоном, кривыми и цветом, а также вырабатывать повторяемый стиль обработки.',
    results: [
      'читаете гистограмму',
      'контролируете тон и контраст',
      'уверенно работаете с цветом',
      'понимаете, как получать одинаковый результат на серии'
    ],
    modules: [
      {
        title: 'Анализ изображения',
        lessons: [
          'Гистограмма: углублённый разбор',
          'Анализ ч/б и цветных изображений',
          'Snapshots и виртуальные копии'
        ]
      },
      {
        title: 'Тон',
        lessons: [
          'Проявка RAW',
          'Прямая и обратная раздвижка',
          'Перераспределение контраста'
        ]
      },
      {
        title: 'Кривые',
        lessons: [
          'Параметрическая кривая',
          'Точечная кривая',
          'Поканальные кривые',
          'Контраст и «плёночные» кривые'
        ]
      },
      {
        title: 'Цвет',
        lessons: [
          'HSL: логика и практика',
          'Split Toning',
          'Calibration: исправление и креатив',
          'Практика цветокоррекции'
        ]
      },
      {
        title: 'Детали',
        lessons: [
          'Резкость и шум',
          'Texture, Clarity, Dehaze',
          'Виньетка и зерно'
        ]
      },
      {
        title: 'Геометрия и маски',
        lessons: [
          'Lens Corrections',
          'Transform и направляющие',
          'Маски: авто и ручные',
          'Практика в разных жанрах'
        ]
      },
      {
        title: 'Пакетная работа',
        lessons: [
          'Синхронизация обработки',
          'Пресеты: создание и логика',
          'Работа с внешними пресетами'
        ]
      }
    ]
  },
  {
    id: 3,
    color: '#f97316',
    title: 'Lightroom PRO: интерьер, коммерция и работа по ТЗ',
    level: 'Продвинутый',
    levelColor: '#f97316',
    forWhom: [
      'интерьерные и коммерческие фотографы',
      'те, кто работает или хочет работать с клиентами',
      'кому важна стабильность, скорость и предсказуемость результата'
    ],
    description: 'Курс о профессиональной работе: система каталогов, сложная обработка интерьеров, HDR, работа по референсу и требованиям заказчика.',
    results: [
      'выстраиваете удобную систему хранения',
      'обрабатываете интерьерные съёмки профессионально',
      'понимаете цвет и геометрию в коммерческих проектах',
      'готовы к реальной работе с клиентами'
    ],
    modules: [
      {
        title: 'Каталог и система',
        lessons: [
          'Один vs несколько каталогов',
          'Физическое и логическое хранение',
          'Коллекции и смарт-коллекции',
          'Практика каталогизации'
        ]
      },
      {
        title: 'Интерьерная обработка',
        lessons: [
          'Геометрия интерьеров',
          'Цвет в интерьере',
          'Маски и локальные правки',
          'Практика интерьерной обработки'
        ]
      },
      {
        title: 'HDR и панорамы',
        lessons: [
          'Динамический диапазон',
          'Склейка HDR',
          'Панорамы и HDR-панорамы',
          'Артефакты и альтернативы'
        ]
      },
      {
        title: 'Работа по референсу',
        lessons: [
          'Анализ изображения',
          'Обработка по референсу',
          'Интерьер vs репортаж'
        ]
      },
      {
        title: 'Экспорт и цвет',
        lessons: [
          'Цветовые пространства',
          'Экспорт под ТЗ',
          'Интеграция с Photoshop'
        ]
      }
    ]
  },
  {
    id: 4,
    color: '#3b82f6',
    title: 'Adobe Photoshop для фотографов: база',
    level: 'Начальный',
    levelColor: '#3b82f6',
    forWhom: [
      'вы боитесь Photoshop',
      'работаете в Lightroom, но понимаете, что его не хватает',
      'не понимаете, чем он отличается от Lightroom',
      'хотите уверенно открыть файл и не «сломать» изображение'
    ],
    description: 'Пошаговое и логичное погружение в Photoshop именно для фотографов: без дизайнерских лишних инструментов, но с правильной цветовой и технической базой.',
    results: [
      'понимаете логику Photoshop',
      'корректно открываете и сохраняете файлы',
      'умеете работать со слоями и масками',
      'корректно настраиваете цвет',
      'уверенно используете кривые',
      'готовы к ретуши и сложной обработке'
    ],
    modules: [
      {
        title: 'Photoshop и фотография',
        lessons: [
          'Чем Photoshop отличается от Lightroom',
          'Когда Lightroom уже не справляется',
          'Стратегия работы фотографа: LR → PS → LR'
        ]
      },
      {
        title: 'Подготовка и настройки',
        lessons: [
          'Настройки Photoshop для фотографа',
          'Color Settings и управление цветом',
          'Настройки Adobe Camera Raw'
        ]
      },
      {
        title: 'Интерфейс и рабочая среда',
        lessons: [
          'Интерфейс Photoshop',
          'Палитра инструментов',
          'Организация рабочих панелей',
          'Создание персонального рабочего пространства'
        ]
      },
      {
        title: 'Работа с файлами',
        lessons: [
          'Открытие файлов',
          'Навигация и режимы экранов',
          'Форматы PSD, TIFF, JPEG',
          'Save, Save As, Save for Web'
        ]
      },
      {
        title: 'Размер и кадрирование',
        lessons: [
          'Image Size: изменение размера',
          'Canvas Size: холст',
          'Crop Tool и стратегии кадрирования'
        ]
      },
      {
        title: 'Слои',
        lessons: [
          'Типы слоёв',
          'Корректирующие слои',
          'Смарт-объекты',
          'Группы слоёв'
        ]
      },
      {
        title: 'Маски',
        lessons: [
          'Растровая маска слоя',
          'Практика работы с масками'
        ]
      },
      {
        title: 'Тон и гистограмма',
        lessons: [
          'Гистограмма в Photoshop',
          'Кривые: интерфейс и принципы',
          'Установка чёрной и белой точки'
        ]
      }
    ]
  }
]

// Состояние развёрнутых курсов
const expandedCourses = ref<Set<number>>(new Set())

const toggleCourse = (courseId: number) => {
  if (expandedCourses.value.has(courseId)) {
    expandedCourses.value.delete(courseId)
  } else {
    expandedCourses.value.add(courseId)
  }
}

const isCourseExpanded = (courseId: number) => {
  return expandedCourses.value.has(courseId)
}
</script>

<template>
  <div class="courses">
    <section class="courses__intro">
      <h1 class="courses__intro-title">Онлайн-курсы по обработке</h1>
      <p class="courses__intro-subtitle">
        Системное обучение Adobe Lightroom и Photoshop — от основ до профессионального уровня
      </p>
    </section>

    <section 
      v-for="course in courses" 
      :key="course.id" 
      class="course-section"
    >
      <div class="course-card">
        <div class="course-card__header">
          <span class="course-card__number" :style="{ backgroundColor: course.color }">
            {{ course.id }}
          </span>
          <span class="course-card__level" :style="{ color: course.levelColor }">
            {{ course.level }}
          </span>
        </div>

        <h2 class="course-card__title">{{ course.title }}</h2>
        
        <p class="course-card__description">{{ course.description }}</p>

        <div class="course-card__section">
          <h3 class="course-card__section-title">Для кого</h3>
          <ul class="course-card__list">
            <li v-for="(item, index) in course.forWhom" :key="index">{{ item }}</li>
          </ul>
        </div>

        <div class="course-card__section">
          <h3 class="course-card__section-title">В результате</h3>
          <ul class="course-card__list course-card__list--results">
            <li v-for="(item, index) in course.results" :key="index">{{ item }}</li>
          </ul>
        </div>

        <!-- Кнопка показать/скрыть программу -->
        <button 
          class="course-card__toggle"
          :class="{ 'course-card__toggle--expanded': isCourseExpanded(course.id) }"
          @click="toggleCourse(course.id)"
        >
          <span>{{ isCourseExpanded(course.id) ? 'Скрыть программу' : 'Показать программу' }}</span>
          <svg 
            class="course-card__toggle-icon" 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none"
          >
            <path 
              d="M5 7.5L10 12.5L15 7.5" 
              stroke="currentColor" 
              stroke-width="1.5" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <!-- Программа курса (дропдаун) -->
        <div 
          v-if="isCourseExpanded(course.id)" 
          class="course-card__modules"
        >
          <div 
            v-for="(module, mIndex) in course.modules" 
            :key="mIndex" 
            class="course-module"
          >
            <div class="course-module__header">
              <span class="course-module__number">Модуль {{ mIndex + 1 }}</span>
              <h4 class="course-module__title">{{ module.title }}</h4>
            </div>
            <ul class="course-module__lessons">
              <li v-for="(lesson, lIndex) in module.lessons" :key="lIndex">
                {{ lesson }}
              </li>
            </ul>
          </div>
        </div>

        <button class="course-card__button">
          Записаться на курс
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.courses {
  width: 100%;
}

.courses__intro {
  max-width: 1100px;
  margin: 0 auto 48px;
  padding: 0 24px;
}

.courses__intro-title {
  font-size: 30px;
  font-weight: 300;
  margin: 0 0 12px;
  letter-spacing: 0.01em;
  line-height: 1.05;
}

.courses__intro-subtitle {
  font-size: 18px;
  color: #666;
  margin: 0;
}

.course-section {
  margin-bottom: 48px;
  padding: 0 24px;
}

.course-card {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px;
  border-radius: 24px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
}

.course-card__header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.course-card__number {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.course-card__level {
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.course-card__title {
  font-size: 26px;
  font-weight: 500;
  margin: 0 0 16px;
  line-height: 1.3;
}

.course-card__description {
  font-size: 17px;
  color: #374151;
  margin: 0 0 24px;
  line-height: 1.6;
}

.course-card__section {
  margin-bottom: 20px;
}

.course-card__section-title {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 10px;
}

.course-card__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.course-card__list li {
  font-size: 15px;
  color: #374151;
  padding-left: 20px;
  position: relative;
}

.course-card__list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #9ca3af;
}

.course-card__list--results li::before {
  content: '✓';
  color: #22c55e;
}

/* Toggle button */
.course-card__toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 12px 0;
  font-size: 15px;
  font-weight: 500;
  color: #3b82f6;
  cursor: pointer;
  transition: color 0.2s;
  margin-top: 8px;
}

.course-card__toggle:hover {
  color: #2563eb;
}

.course-card__toggle-icon {
  transition: transform 0.3s ease;
}

.course-card__toggle--expanded .course-card__toggle-icon {
  transform: rotate(180deg);
}

/* Modules dropdown */
.course-card__modules {
  margin-top: 16px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 24px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.course-module {
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
}

.course-module__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.course-module__number {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.course-module__title {
  font-size: 17px;
  font-weight: 500;
  color: #111827;
  margin: 0;
}

.course-module__lessons {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.course-module__lessons li {
  font-size: 14px;
  color: #4b5563;
  padding-left: 16px;
  position: relative;
}

.course-module__lessons li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #9ca3af;
}

/* Button */
.course-card__button {
  margin-top: 24px;
  padding: 14px 32px;
  background: #0f172a;
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.course-card__button:hover {
  background: #1e293b;
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 768px) {
  .course-card {
    padding: 24px;
  }
  
  .course-card__title {
    font-size: 22px;
  }
  
  .course-module {
    padding: 16px;
  }
}
</style>
