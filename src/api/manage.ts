import axios from 'axios';

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
        sns_accounts_count: 0 
      };
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

export const toggleCategoryStatus = async (categoryId: number) => {
  try {
    const res = await axios.patch(`${API_BASE}/manage/categories/${categoryId}/status`, {}, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error('카테고리 상태 변경 실패:', error);
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