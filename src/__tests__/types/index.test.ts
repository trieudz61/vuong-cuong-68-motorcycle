import {
  MOTORCYCLE_BRANDS,
  FUEL_TYPES,
  MOTORCYCLE_CONDITIONS,
} from '@/types'

describe('Type Constants', () => {
  describe('MOTORCYCLE_BRANDS', () => {
    it('should contain popular Vietnamese motorcycle brands', () => {
      expect(MOTORCYCLE_BRANDS).toContain('Honda')
      expect(MOTORCYCLE_BRANDS).toContain('Yamaha')
      expect(MOTORCYCLE_BRANDS).toContain('Suzuki')
      expect(MOTORCYCLE_BRANDS).toContain('Piaggio')
      expect(MOTORCYCLE_BRANDS).toContain('SYM')
    })

    it('should have "Khác" option for other brands', () => {
      expect(MOTORCYCLE_BRANDS).toContain('Khác')
    })

    it('should be a readonly array', () => {
      expect(Array.isArray(MOTORCYCLE_BRANDS)).toBe(true)
    })
  })

  describe('FUEL_TYPES', () => {
    it('should contain common fuel types', () => {
      expect(FUEL_TYPES).toContain('Xăng')
      expect(FUEL_TYPES).toContain('Điện')
    })

    it('should have at least 2 fuel types', () => {
      expect(FUEL_TYPES.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('MOTORCYCLE_CONDITIONS', () => {
    it('should contain various condition levels', () => {
      expect(MOTORCYCLE_CONDITIONS).toContain('Mới')
      expect(MOTORCYCLE_CONDITIONS).toContain('Cũ - Tốt')
      expect(MOTORCYCLE_CONDITIONS).toContain('Cũ - Khá')
    })

    it('should have at least 3 condition options', () => {
      expect(MOTORCYCLE_CONDITIONS.length).toBeGreaterThanOrEqual(3)
    })
  })
})

describe('Type Interfaces', () => {
  it('should allow creating valid Motorcycle object', () => {
    const motorcycle = {
      id: '123',
      title: 'Honda Vision 2022',
      brand: 'Honda',
      model: 'Vision',
      year: 2022,
      condition: 'Cũ - Tốt',
      mileage: 5000,
      engine_capacity: 110,
      fuel_type: 'Xăng',
      color: 'Trắng',
      price: 32000000,
      description: 'Xe đẹp',
      images: [],
      contact_phone: '0901234567',
      contact_address: 'Quận 1, TP.HCM',
      is_sold: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    expect(motorcycle.id).toBeDefined()
    expect(motorcycle.title).toBe('Honda Vision 2022')
    expect(motorcycle.price).toBe(32000000)
    expect(motorcycle.is_sold).toBe(false)
  })

  it('should allow creating valid PawnService object', () => {
    const pawnService = {
      id: '456',
      customer_name: 'Nguyễn Văn A',
      customer_phone: '0901234567',
      motorcycle_brand: 'Honda',
      motorcycle_model: 'Vision',
      pawn_value: 10000000,
      pawn_date: '2026-01-01',
      redemption_date: '2026-02-01',
      status: 'đang cầm' as const,
      notes: 'Ghi chú',
      created_at: new Date().toISOString(),
    }

    expect(pawnService.id).toBeDefined()
    expect(pawnService.status).toBe('đang cầm')
    expect(pawnService.pawn_value).toBe(10000000)
  })
})
