import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

import App from '../App.vue'
import SiteHeader from '../components/layout/SiteHeader.vue'
import SiteFooter from '../components/layout/SiteFooter.vue'
import BeforeAfterSlider from '../components/BeforeAfterSlider.vue'
import ConsultationForm from '../components/ConsultationForm.vue'
import ProtectedImage from '../components/ProtectedImage.vue'

import { useGalleryStore } from '../stores/gallery'
import * as api from '../api'

import emailjs from '@emailjs/browser'

vi.mock('../api', async () => {
  const actual = await vi.importActual('../api')
  return {
    ...actual,
    fetchAllImages: vi.fn(),
    fetchAlbums: vi.fn(),
    createAlbum: vi.fn(),
    uploadImage: vi.fn(),
    deleteImage: vi.fn(),
  }
})

vi.mock('@emailjs/browser', () => ({
  default: {
    send: vi.fn(),
  },
}))

// для API тестов
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

global.fetch = vi.fn()
const mockFetch = vi.mocked(fetch)

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div>Home</div>' } }],
})

// 2 теста App
describe('App', () => {
  it('должен монтироваться', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('#app').exists()).toBe(true)
  })

  it('должен содержать основные компоненты', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })
    expect(wrapper.findComponent(SiteHeader).exists()).toBe(true)
    expect(wrapper.findComponent(SiteFooter).exists()).toBe(true)
    expect(wrapper.find('main.page-content').exists()).toBe(true)
  })
})

// 3 теста Gallery Store
describe('Gallery Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('должен инициализироваться с пустыми данными', () => {
    const store = useGalleryStore()
    expect(store.albums).toEqual([])
    expect(store.images).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('должен загружать данные через fetchAll', async () => {
    const mockData = [
      {
        album: {
          id: 1,
          name: 'Album 1',
          description: 'Description',
          coverImageId: null,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
        images: [
          {
            id: 1,
            filename: 'img1.jpg',
            originalName: 'img1.jpg',
            description: null,
            width: 100,
            height: 100,
            uploadedAt: '2024-01-01',
            webUrl: '/img1.jpg',
            thumbnailUrl: '/thumb1.jpg',
          },
        ],
      },
    ]

    vi.mocked(api.fetchAllImages).mockResolvedValue(mockData)

    const store = useGalleryStore()
    await store.fetchAll()

    expect(store.albums).toHaveLength(1)
    expect(store.images).toHaveLength(1)
    expect(store.isLoading).toBe(false)
  })

  it('должен группировать изображения по альбомам', () => {
    const store = useGalleryStore()

    store.albums = [
      { id: 1, name: 'Album 1', description: null, coverImageId: null, createdAt: '2024-01-01' },
      { id: 2, name: 'Album 2', description: null, coverImageId: null, createdAt: '2024-01-02' },
    ]

    store.images = [
      {
        id: 1,
        filename: 'img1.jpg',
        originalName: 'img1.jpg',
        description: null,
        width: 100,
        height: 100,
        uploadedAt: '2024-01-01',
        webUrl: '/img1.jpg',
        thumbnailUrl: '/thumb1.jpg',
        albumId: 1,
      },
      {
        id: 2,
        filename: 'img2.jpg',
        originalName: 'img2.jpg',
        description: null,
        width: 200,
        height: 200,
        uploadedAt: '2024-01-01',
        webUrl: '/img2.jpg',
        thumbnailUrl: '/thumb2.jpg',
        albumId: 1,
      },
    ]

    const grouped = store.imagesByAlbum
    expect(grouped[1]).toHaveLength(2)
    expect(grouped[2]).toHaveLength(0)
  })
})

// 3 теста BeforeAfterSlider
describe('BeforeAfterSlider', () => {
  const defaultProps = {
    beforeImage: '/before.jpg',
    afterImage: '/after.jpg',
  }

  it('должен монтироваться', () => {
    const wrapper = mount(BeforeAfterSlider, {
      props: defaultProps,
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('должен начинать с позиции слайдера 50%', () => {
    const wrapper = mount(BeforeAfterSlider, {
      props: defaultProps,
    })
    const divider = wrapper.find('.before-after-slider__divider')
    expect(divider.attributes('style')).toContain('left: 50%')
  })
})

// 2 теста ConsultationForm
describe('ConsultationForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'test_service')
    vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', 'test_template')
    vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', 'test_key')
  })

  it('должен монтироваться', async () => {
    const wrapper = mount(ConsultationForm, {
      global: {
        plugins: [router],
      },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('должен отправлять форму', async () => {
    vi.mocked(emailjs.send).mockResolvedValue({ status: 200, text: 'OK' })

    const wrapper = mount(ConsultationForm, {
      global: {
        plugins: [router],
      },
    })

    const form = wrapper.find('form')
    const nameInput = form.find('input[type="text"]')
    const emailInput = form.find('input[type="email"]')
    const phoneInput = form.find('input[type="tel"]')
    const subjectInput = form.findAll('input[type="text"]')[1]
    const messageInput = form.find('textarea')

    await nameInput.setValue('Иван')
    await emailInput.setValue('ivan@example.com')
    await phoneInput.setValue('+79991234567')
    await subjectInput.setValue('Тема')
    await messageInput.setValue('Сообщение')

    await form.trigger('submit')
    await wrapper.vm.$nextTick()
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(emailjs.send).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Спасибо! Сообщение отправлено.')
  })
})

// 3 теста ProtectedImage
describe('ProtectedImage', () => {
  beforeEach(() => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))

    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      configurable: true,
      value: 1,
    })
  })

  it('должен монтироваться', () => {
    const wrapper = mount(ProtectedImage, {
      props: {
        src: '/test-image.jpg',
      },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.protected-image').exists()).toBe(true)
  })

  it('должен показывать скелетон во время загрузки', () => {
    const wrapper = mount(ProtectedImage, {
      props: {
        src: '/test-image.jpg',
      },
    })
    expect(wrapper.find('.protected-image__skeleton').exists()).toBe(true)
  })

  it('должен использовать значения по умолчанию', () => {
    const wrapper = mount(ProtectedImage, {
      props: {
        src: '/test-image.jpg',
      },
    })
    expect(wrapper.props('fit')).toBe('contain')
    expect(wrapper.props('autoHeight')).toBe(false)
  })
})

// 3 теста API Module
describe('API Module', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    localStorageMock.clear()
    vi.stubEnv('VITE_API_URL', 'http://localhost:5001')

    const actualApi = await vi.importActual<typeof api>('../api')
    Object.assign(api, actualApi)
    api.clearToken()
  })

  it('должен управлять токеном', () => {
    api.setToken('test-token')
    expect(api.getToken()).toBe('test-token')

    api.clearToken()
    expect(api.getToken()).toBeNull()
  })

  it('должен выполнять вход', async () => {
    const mockResponse = {
      message: 'Success',
      user: { id: 1, login: 'admin', isAdmin: true },
      token: 'auth-token-123',
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const result = await api.login('admin', 'password')

    expect(result).toEqual(mockResponse)
    expect(api.getToken()).toBe('auth-token-123')
  })

  it('должен получать альбомы', async () => {
    const mockAlbums = [
      {
        id: 1,
        name: 'Album 1',
        description: 'Description',
        coverImageId: null,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      },
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockAlbums,
    } as Response)

    const result = await api.fetchAlbums()

    expect(result).toEqual(mockAlbums)
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:5001/api/albums')
  })
})
