import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonLabel
} from '@ionic/react';
import { MemoryBlock, AllocationRequest } from '../pages/MemoryAllocation';

interface AllocationStatisticsProps {
  memoryBlocks: MemoryBlock[];
  allocationRequests: AllocationRequest[];
  memorySize: number;
}

const AllocationStatistics: React.FC<AllocationStatisticsProps> = ({
  memoryBlocks,
  allocationRequests,
  memorySize
}) => {
  // 计算分配统计
  const calculateAllocationStats = () => {
    const totalRequests = allocationRequests.length;
    const successfulAllocations = allocationRequests.filter(req => req.allocated).length;
    const failedAllocations = totalRequests - successfulAllocations;
    const successRate = totalRequests > 0 ? (successfulAllocations / totalRequests) * 100 : 0;
    
    return {
      totalRequests,
      successfulAllocations,
      failedAllocations,
      successRate: Math.round(successRate * 100) / 100
    };
  };

  // 计算内存利用率
  const calculateMemoryUtilization = () => {
    const allocatedMemory = memoryBlocks
      .filter(block => block.allocated)
      .reduce((sum, block) => sum + block.size, 0);
    
    const utilization = (allocatedMemory / memorySize) * 100;
    
    return {
      allocated: allocatedMemory,
      utilization: Math.round(utilization * 100) / 100
    };
  };

  // 计算碎片化统计
  const calculateFragmentationStats = () => {
    const freeBlocks = memoryBlocks.filter(block => !block.allocated);
    const totalFreeMemory = freeBlocks.reduce((sum, block) => sum + block.size, 0);
    
    if (freeBlocks.length === 0) {
      return {
        freeBlocks: 0,
        largestFreeBlock: 0,
        averageFreeBlockSize: 0,
        externalFragmentation: 0
      };
    }
    
    const largestFreeBlock = Math.max(...freeBlocks.map(block => block.size));
    const averageFreeBlockSize = totalFreeMemory / freeBlocks.length;
    
    // 外部碎片化 = (总空闲内存 - 最大空闲块) / 总空闲内存
    const externalFragmentation = totalFreeMemory > 0 
      ? ((totalFreeMemory - largestFreeBlock) / totalFreeMemory) * 100 
      : 0;
    
    return {
      freeBlocks: freeBlocks.length,
      largestFreeBlock,
      averageFreeBlockSize: Math.round(averageFreeBlockSize * 100) / 100,
      externalFragmentation: Math.round(externalFragmentation * 100) / 100
    };
  };

  // 计算分配效率
  const calculateAllocationEfficiency = () => {
    const allocatedBlocks = memoryBlocks.filter(block => block.allocated);
    
    if (allocatedBlocks.length === 0) {
      return {
        averageAllocationSize: 0,
        smallestAllocation: 0,
        largestAllocation: 0,
        allocationVariance: 0
      };
    }
    
    const allocationSizes = allocatedBlocks.map(block => block.size);
    const averageAllocationSize = allocationSizes.reduce((sum, size) => sum + size, 0) / allocationSizes.length;
    const smallestAllocation = Math.min(...allocationSizes);
    const largestAllocation = Math.max(...allocationSizes);
    
    // 计算方差来衡量分配大小的分散程度
    const variance = allocationSizes.reduce((sum, size) => {
      return sum + Math.pow(size - averageAllocationSize, 2);
    }, 0) / allocationSizes.length;
    
    return {
      averageAllocationSize: Math.round(averageAllocationSize * 100) / 100,
      smallestAllocation,
      largestAllocation,
      allocationVariance: Math.round(variance * 100) / 100
    };
  };

  const allocationStats = calculateAllocationStats();
  const memoryUtilization = calculateMemoryUtilization();
  const fragmentationStats = calculateFragmentationStats();
  const allocationEfficiency = calculateAllocationEfficiency();

  // 获取性能评级
  const getPerformanceRating = () => {
    const { successRate } = allocationStats;
    const { utilization } = memoryUtilization;
    const { externalFragmentation } = fragmentationStats;
    
    // 综合评分：成功率权重40%，利用率权重30%，碎片化权重30%（越低越好）
    const score = (successRate * 0.4) + (utilization * 0.3) + ((100 - externalFragmentation) * 0.3);
    
    if (score >= 80) return { rating: '优秀', color: 'success' };
    if (score >= 60) return { rating: '良好', color: 'primary' };
    if (score >= 40) return { rating: '一般', color: 'warning' };
    return { rating: '需要改进', color: 'danger' };
  };

  const performance = getPerformanceRating();

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>分配统计与分析</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {/* 总体性能评级 */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <IonChip color={performance.color} style={{ fontSize: '1.1rem', padding: '8px 16px' }}>
            <IonLabel>总体性能: {performance.rating}</IonLabel>
          </IonChip>
        </div>

        {/* 分配统计 */}
        <div style={{ marginBottom: '24px' }}>
          <h3>分配统计</h3>
          <IonGrid>
            <IonRow>
              <IonCol size="6" sizeMd="3">
                <div className="stat-card">
                  <div className="stat-value">{allocationStats.totalRequests}</div>
                  <div className="stat-label">总请求数</div>
                </div>
              </IonCol>
              <IonCol size="6" sizeMd="3">
                <div className="stat-card">
                  <div className="stat-value">{allocationStats.successfulAllocations}</div>
                  <div className="stat-label">成功分配</div>
                </div>
              </IonCol>
              <IonCol size="6" sizeMd="3">
                <div className="stat-card">
                  <div className="stat-value">{allocationStats.failedAllocations}</div>
                  <div className="stat-label">分配失败</div>
                </div>
              </IonCol>
              <IonCol size="6" sizeMd="3">
                <div className="stat-card">
                  <div className="stat-value">{allocationStats.successRate}%</div>
                  <div className="stat-label">成功率</div>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        {/* 内存利用率 */}
        <div style={{ marginBottom: '24px' }}>
          <h3>内存利用率</h3>
          <IonGrid>
            <IonRow>
              <IonCol size="6" sizeMd="4">
                <div className="stat-card">
                  <div className="stat-value">{memoryUtilization.allocated}KB</div>
                  <div className="stat-label">已分配内存</div>
                </div>
              </IonCol>
              <IonCol size="6" sizeMd="4">
                <div className="stat-card">
                  <div className="stat-value">{memorySize - memoryUtilization.allocated}KB</div>
                  <div className="stat-label">剩余内存</div>
                </div>
              </IonCol>
              <IonCol size="12" sizeMd="4">
                <div className="stat-card">
                  <div className="stat-value">{memoryUtilization.utilization}%</div>
                  <div className="stat-label">利用率</div>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        {/* 碎片化分析 */}
        <div style={{ marginBottom: '24px' }}>
          <h3>碎片化分析</h3>
          <IonGrid>
            <IonRow>
              <IonCol size="6" sizeMd="3">
                <div className="stat-card">
                  <div className="stat-value">{fragmentationStats.freeBlocks}</div>
                  <div className="stat-label">空闲块数</div>
                </div>
              </IonCol>
              <IonCol size="6" sizeMd="3">
                <div className="stat-card">
                  <div className="stat-value">{fragmentationStats.largestFreeBlock}KB</div>
                  <div className="stat-label">最大空闲块</div>
                </div>
              </IonCol>
              <IonCol size="6" sizeMd="3">
                <div className="stat-card">
                  <div className="stat-value">{fragmentationStats.averageFreeBlockSize}KB</div>
                  <div className="stat-label">平均空闲块大小</div>
                </div>
              </IonCol>
              <IonCol size="6" sizeMd="3">
                <div className="stat-card">
                  <div className="stat-value">{fragmentationStats.externalFragmentation}%</div>
                  <div className="stat-label">外部碎片化</div>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        {/* 分配效率 */}
        <div style={{ marginBottom: '24px' }}>
          <h3>分配效率</h3>
          <IonGrid>
            <IonRow>
              <IonCol size="6" sizeMd="3">
                <div className="stat-card">
                  <div className="stat-value">{allocationEfficiency.averageAllocationSize}KB</div>
                  <div className="stat-label">平均分配大小</div>
                </div>
              </IonCol>
              <IonCol size="6" sizeMd="3">
                <div className="stat-card">
                  <div className="stat-value">{allocationEfficiency.smallestAllocation}KB</div>
                  <div className="stat-label">最小分配</div>
                </div>
              </IonCol>
              <IonCol size="6" sizeMd="3">
                <div className="stat-card">
                  <div className="stat-value">{allocationEfficiency.largestAllocation}KB</div>
                  <div className="stat-label">最大分配</div>
                </div>
              </IonCol>
              <IonCol size="6" sizeMd="3">
                <div className="stat-card">
                  <div className="stat-value">{allocationEfficiency.allocationVariance}</div>
                  <div className="stat-label">分配方差</div>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        {/* 性能建议 */}
        <div>
          <h3>性能建议</h3>
          <div className="performance-suggestions">
            {allocationStats.successRate < 80 && (
              <div className="suggestion-item">
                <IonChip color="warning">
                  <IonLabel>建议</IonLabel>
                </IonChip>
                <span>分配成功率较低，考虑使用更适合的分配算法或增加内存大小</span>
              </div>
            )}
            
            {fragmentationStats.externalFragmentation > 50 && (
              <div className="suggestion-item">
                <IonChip color="danger">
                  <IonLabel>警告</IonLabel>
                </IonChip>
                <span>外部碎片化严重，建议进行内存整理或使用分页/分段机制</span>
              </div>
            )}
            
            {memoryUtilization.utilization < 50 && allocationStats.totalRequests > 0 && (
              <div className="suggestion-item">
                <IonChip color="primary">
                  <IonLabel>提示</IonLabel>
                </IonChip>
                <span>内存利用率较低，可以考虑减少内存大小或增加更多进程</span>
              </div>
            )}
            
            {fragmentationStats.freeBlocks > 5 && (
              <div className="suggestion-item">
                <IonChip color="warning">
                  <IonLabel>建议</IonLabel>
                </IonChip>
                <span>空闲块过多，考虑使用合并算法减少碎片化</span>
              </div>
            )}
          </div>
        </div>

        {allocationRequests.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ion-color-medium)' }}>
            <p>暂无分配数据</p>
            <p>请添加内存分配请求开始分析</p>
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default AllocationStatistics;
