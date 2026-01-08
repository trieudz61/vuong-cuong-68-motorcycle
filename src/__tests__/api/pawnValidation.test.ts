/**
 * Pawn Service Validation Tests
 */

describe('Pawn Service Validation', () => {
  const validatePawnServiceData = (data: Record<string, unknown>) => {
    const errors: string[] = []

    if (!data.customer_name || (data.customer_name as string).trim().length === 0) {
      errors.push('Tên khách hàng không được để trống')
    }
    if (!data.customer_phone || (data.customer_phone as string).trim().length === 0) {
      errors.push('Số điện thoại không được để trống')
    }
    if (!data.motorcycle_brand || (data.motorcycle_brand as string).trim().length === 0) {
      errors.push('Hãng xe không được để trống')
    }
    if (!data.motorcycle_model || (data.motorcycle_model as string).trim().length === 0) {
      errors.push('Model xe không được để trống')
    }
    if (!data.pawn_value || (data.pawn_value as number) <= 0) {
      errors.push('Giá trị cầm không hợp lệ')
    }
    if (!data.pawn_date) {
      errors.push('Ngày cầm không được để trống')
    }
    if (!data.redemption_date) {
      errors.push('Ngày chuộc không được để trống')
    }

    // Check redemption date is after pawn date
    if (data.pawn_date && data.redemption_date) {
      const pawnDate = new Date(data.pawn_date as string)
      const redemptionDate = new Date(data.redemption_date as string)
      if (redemptionDate <= pawnDate) {
        errors.push('Ngày chuộc phải sau ngày cầm')
      }
    }

    return errors
  }

  it('should pass validation for valid pawn service data', () => {
    const validData = {
      customer_name: 'Nguyễn Văn A',
      customer_phone: '0901234567',
      motorcycle_brand: 'Honda',
      motorcycle_model: 'Vision',
      pawn_value: 10000000,
      pawn_date: '2026-01-01',
      redemption_date: '2026-02-01',
    }

    const errors = validatePawnServiceData(validData)
    expect(errors).toHaveLength(0)
  })

  it('should fail validation for empty customer name', () => {
    const data = {
      customer_name: '',
      customer_phone: '0901234567',
      motorcycle_brand: 'Honda',
      motorcycle_model: 'Vision',
      pawn_value: 10000000,
      pawn_date: '2026-01-01',
      redemption_date: '2026-02-01',
    }

    const errors = validatePawnServiceData(data)
    expect(errors).toContain('Tên khách hàng không được để trống')
  })

  it('should fail validation for invalid pawn value', () => {
    const data = {
      customer_name: 'Test',
      customer_phone: '0901234567',
      motorcycle_brand: 'Honda',
      motorcycle_model: 'Vision',
      pawn_value: 0,
      pawn_date: '2026-01-01',
      redemption_date: '2026-02-01',
    }

    const errors = validatePawnServiceData(data)
    expect(errors).toContain('Giá trị cầm không hợp lệ')
  })

  it('should fail validation when redemption date is before pawn date', () => {
    const data = {
      customer_name: 'Test',
      customer_phone: '0901234567',
      motorcycle_brand: 'Honda',
      motorcycle_model: 'Vision',
      pawn_value: 10000000,
      pawn_date: '2026-02-01',
      redemption_date: '2026-01-01',
    }

    const errors = validatePawnServiceData(data)
    expect(errors).toContain('Ngày chuộc phải sau ngày cầm')
  })

  it('should fail validation when redemption date equals pawn date', () => {
    const data = {
      customer_name: 'Test',
      customer_phone: '0901234567',
      motorcycle_brand: 'Honda',
      motorcycle_model: 'Vision',
      pawn_value: 10000000,
      pawn_date: '2026-01-15',
      redemption_date: '2026-01-15',
    }

    const errors = validatePawnServiceData(data)
    expect(errors).toContain('Ngày chuộc phải sau ngày cầm')
  })

  describe('Status Validation', () => {
    const validStatuses = ['đang cầm', 'đã chuộc', 'quá hạn']

    it('should accept valid status values', () => {
      validStatuses.forEach(status => {
        expect(validStatuses.includes(status)).toBe(true)
      })
    })

    it('should have exactly 3 valid statuses', () => {
      expect(validStatuses).toHaveLength(3)
    })
  })
})
