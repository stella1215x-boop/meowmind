/**
 * Streak 계산 서비스
 *
 * 규칙:
 * 1. 오늘 작성 → streak +1
 * 2. 어제 작성 후 오늘 작성 → streak +1 (정상)
 * 3. 정확히 1일 건너뜀 → 그레이스 데이 (7일 윈도우 내 1회 한정, 조용히 처리)
 * 4. 2일 이상 연속 건너뜀 → streak 리셋 (= 1, 오늘부터 재시작)
 */

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function daysBetween(earlier, later) {
  return Math.round((startOfDay(later) - startOfDay(earlier)) / 86400000)
}

/**
 * 최근 엔트리 기준으로 7일 윈도우 내 그레이스 데이 사용 여부 확인
 * entries: createdAt 기준 최신순 정렬된 배열
 */
function hasGraceDayInWindow(entries) {
  if (!entries || entries.length < 2) return false

  const windowStart = new Date()
  windowStart.setDate(windowStart.getDate() - 7)
  windowStart.setHours(0, 0, 0, 0)

  for (let i = 0; i < entries.length - 1; i++) {
    const curr = new Date(entries[i].createdAt)
    const prev = new Date(entries[i + 1].createdAt)

    // 7일 윈도우 바깥이면 중단
    if (curr < windowStart) break

    const gap = daysBetween(prev, curr)
    if (gap === 2) return true   // 이미 그레이스 사용됨
    if (gap > 2) break           // 연속 미작성 → 윈도우 무의미
  }

  return false
}

/**
 * 새 일지 제출 시 streak 업데이트 값 계산
 * @param {object} cat - 현재 Cat 레코드 (lastFedAt, currentStreak, longestStreak)
 * @param {Array}  recentEntries - 최근 8개 이내 JournalEntry (최신순)
 * @returns {{ newStreak, newLongest, graceDayUsed }}
 */
export function calculateStreakUpdate(cat, recentEntries) {
  const today = new Date()

  // 첫 번째 일지 (lastFedAt 없음)
  if (!cat.lastFedAt) {
    return {
      newStreak: 1,
      newLongest: Math.max(cat.longestStreak ?? 0, 1),
      graceDayUsed: false,
    }
  }

  const daysDiff = daysBetween(cat.lastFedAt, today)

  // 0일 차 → 오늘 이미 작성 (호출자가 걸러야 하지만 방어적 처리)
  if (daysDiff === 0) {
    return {
      newStreak: cat.currentStreak,
      newLongest: cat.longestStreak,
      graceDayUsed: false,
    }
  }

  // 1일 차 → 어제 작성, 정상 연속
  if (daysDiff === 1) {
    const ns = cat.currentStreak + 1
    return {
      newStreak: ns,
      newLongest: Math.max(cat.longestStreak, ns),
      graceDayUsed: false,
    }
  }

  // 2일 차 → 1일 건너뜀 → 그레이스 데이 후보
  if (daysDiff === 2) {
    const graceAlreadyUsed = hasGraceDayInWindow(recentEntries)

    if (!graceAlreadyUsed) {
      // 조용히 그레이스 적용 — 사용자에게 알리지 않음
      const ns = cat.currentStreak + 1
      return {
        newStreak: ns,
        newLongest: Math.max(cat.longestStreak, ns),
        graceDayUsed: true,
      }
    }
  }

  // 3일 이상 건너뜀, 또는 그레이스 소진 → 스트릭 리셋
  return {
    newStreak: 1,
    newLongest: cat.longestStreak,
    graceDayUsed: false,
  }
}
