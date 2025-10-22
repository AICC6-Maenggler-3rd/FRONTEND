import axios from 'axios';
import type { Accommodation } from './accommodation';

const API_BASE = import.meta.env.VITE_API_HOST || 'http://localhost:8000'; // FastAPI 주소

export const getDashboardData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/manage/dashboard`, {
        withCredentials: true,
      });
      return res.data;
    } catch (error) {
      console.error('대시보드 데이터 조회 실패:', error);
      return { 
        users_count: 0, 
        places_count: 0, 
        categories_count: 0,
        sns_accounts_count: 0,
        accommodations_count: 0
      };
    }
  };

export const getAccommodationsStats = async () => {
  try {
    console.log('숙소 API 호출 시작:', `${API_BASE}/accommodation/list?page=1&limit=12`);
    
    // 첫 페이지에서 총 페이지 수를 이용해 계산
    const res = await axios.get(`${API_BASE}/accommodation/list?page=1&limit=12`);
    
    console.log('숙소 API 응답 상태:', res.status);
    console.log('숙소 API 응답 데이터:', res.data);
    
    // total_pages와 limit을 이용해 총 개수 추정
    const totalPages = res.data.total_pages || 1;
    const limit = 12;
    const estimatedTotal = totalPages * limit;
    
    // 실제 데이터가 있는 경우 더 정확한 계산
    const actualDataCount = res.data.data ? res.data.data.length : 0;
    const finalCount = totalPages === 1 ? actualDataCount : estimatedTotal;
    
    console.log('총 페이지 수:', totalPages);
    console.log('실제 데이터 개수:', actualDataCount);
    console.log('계산된 숙소 개수:', finalCount);
    
    return {
      total_count: finalCount,
      accommodations: res.data.data || []
    };
  } catch (error: any) {
    console.error('숙소 통계 조회 실패:', error);
    console.error('에러 상세:', error.response?.data || error.message);
    return { total_count: 0, accommodations: [] };
  }
};

export const getSnsAccounts = async () => {
  try {
    const res = await axios.get(`${API_BASE}/manage/sns-accounts`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('SNS 계정 목록 조회 실패:', error);
    return { insta_nicknames: [], total_count: 0 };
  }
};

export const createSnsAccount = async (nickname: string) => {
  try {
    const res = await axios.post(`${API_BASE}/manage/sns-accounts`, 
      { nickname }, 
      { withCredentials: true }
    );
    return res.data;
  } catch (error: any) {
    console.error('SNS 계정 등록 실패:', error);
    throw error;
  }
};

export const updateSnsAccount = async (oldNickname: string, newNickname: string, forceMerge: boolean = false) => {
  try {
    console.log('[프론트엔드] SNS 계정 수정 요청:', { oldNickname, newNickname, forceMerge });
    
    // URL 인코딩
    const encodedOldNickname = encodeURIComponent(oldNickname);
    console.log('[프론트엔드] 인코딩된 닉네임:', encodedOldNickname);
    console.log('[프론트엔드] API URL:', `${API_BASE}/manage/sns-accounts/${encodedOldNickname}`);
    
    const res = await axios.patch(`${API_BASE}/manage/sns-accounts/${encodedOldNickname}`, 
      { nickname: newNickname, force_merge: forceMerge }, 
      { withCredentials: true }
    );
    
    console.log('[프론트엔드] SNS 계정 수정 성공:', res.data);
    return res.data;
  } catch (error: any) {
    console.error('[프론트엔드] SNS 계정 수정 실패:', error);
    console.error('[프론트엔드] 에러 응답:', error.response?.data);
    throw error;
  }
};

export const deleteSnsAccount = async (nickname: string) => {
  try {
    // URL 인코딩
    const encodedNickname = encodeURIComponent(nickname);
    const res = await axios.delete(`${API_BASE}/manage/sns-accounts/${encodedNickname}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    console.error('SNS 계정 삭제 실패:', error);
    throw error;
  }
};


export const getSnsAccountsStats = async () => {
  try {
    const res = await axios.get(`${API_BASE}/manage/sns-accounts/stats`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('SNS 계정 통계 조회 실패:', error);
    return { total_accounts: 0, account_stats: [] };
  }
};


export const getUsersList = async () => {
  try {
    const res = await axios.get(`${API_BASE}/manage/users`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('사용자 목록 조회 실패:', error);
    return [];
  }
};

export const getPlacesPopularity = async () => {
  try {
    const res = await axios.get(`${API_BASE}/manage/places/popularity`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('장소 인기도 조회 실패:', error);
    return { popular_places: [], total_places: 0 };
  }
};

export const getPlacesCategoryStats = async () => {
  try {
    const res = await axios.get(`${API_BASE}/manage/places/category-stats`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('카테고리별 장소 통계 조회 실패:', error);
    return { category_stats: [], total_categories: 0 };
  }
};

export const toggleUserStatus = async (userId: number) => {
  try {
    const res = await axios.patch(`${API_BASE}/manage/users/${userId}/status`, {}, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('사용자 상태 변경 실패:', error);
    throw error;
  }
};

export const getUserActivityLogs = async (userId: number) => {
  try {
    const res = await axios.get(`${API_BASE}/manage/users/${userId}/activity-logs`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('사용자 활동 로그 조회 실패:', error);
    throw error;
  }
};

export const deleteUser = async (userId: number) => {
  try {
    const res = await axios.delete(`${API_BASE}/manage/users/${userId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('사용자 삭제 실패:', error);
    throw error;
  }
};

// ==================== 카테고리 관리 API ====================

export interface Category {
  category_id: number;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
  place_count: number;
}

export interface CategoryCreateData {
  name: string;
  status: string;
}

export const getCategoriesList = async (): Promise<{ categories: Category[]; total_count: number }> => {
  try {
    console.log('API 호출 시작:', `${API_BASE}/manage/categories`);
    const res = await axios.get(`${API_BASE}/manage/categories`, {
      withCredentials: true,
    });
    console.log('API 응답:', res.data);
    return res.data;
  } catch (error) {
    console.error('카테고리 목록 조회 실패:', error);
    return { categories: [], total_count: 0 };
  }
};

export const createCategory = async (categoryData: CategoryCreateData) => {
  try {
    const res = await axios.post(`${API_BASE}/manage/categories`, categoryData, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('카테고리 생성 실패:', error);
    throw error;
  }
};

export const updateCategory = async (categoryId: number, categoryData: CategoryCreateData) => {
  try {
    const res = await axios.patch(`${API_BASE}/manage/categories/${categoryId}`, categoryData, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('카테고리 수정 실패:', error);
    throw error;
  }
};


export const deleteCategory = async (categoryId: number) => {
  try {
    const res = await axios.delete(`${API_BASE}/manage/categories/${categoryId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('카테고리 삭제 실패:', error);
    throw error;
  }
};



export const searchAccommodation = async (
  query: string,
  page: number,
  limit: number,
): Promise<{
  data: Accommodation[];
  total_pages: number;
}> => {
  const res = await axios.get(
    `${API_BASE}/accommodation/list?query=${query}&page=${page}&limit=${limit}`,
  );
  return res.data;
};

export const getAccommodationList = async (
  page: number,
  limit: number,
): Promise<{
  data: Accommodation[];
  total_pages: number;
}> => {
  const res = await axios.get(
    `${API_BASE}/accommodation/list?page=${page}&limit=${limit}`,
  );
  return res.data;
};