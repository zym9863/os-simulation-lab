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
import { MemoryBlock } from '../pages/MemoryAllocation';

interface MemoryVisualizationProps {
  memoryBlocks: MemoryBlock[];
  memorySize: number;
}

const MemoryVisualization: React.FC<MemoryVisualizationProps> = ({
  memoryBlocks,
  memorySize
}) => {
  // 计算内存使用率
  const calculateMemoryUsage = () => {
    const allocatedMemory = memoryBlocks
      .filter(block => block.allocated)
      .reduce((sum, block) => sum + block.size, 0);
    
    const freeMemory = memoryBlocks
      .filter(block => !block.allocated)
      .reduce((sum, block) => sum + block.size, 0);
    
    const usagePercentage = (allocatedMemory / memorySize) * 100;
    
    return {
      allocated: allocatedMemory,
      free: freeMemory,
      percentage: Math.round(usagePercentage * 100) / 100
    };
  };

  // 计算碎片化程度
  const calculateFragmentation = () => {
    const freeBlocks = memoryBlocks.filter(block => !block.allocated);
    const totalFreeMemory = freeBlocks.reduce((sum, block) => sum + block.size, 0);
    
    if (freeBlocks.length <= 1 || totalFreeMemory === 0) {
      return 0; // 没有碎片或只有一个空闲块
    }
    
    // 计算最大空闲块大小
    const maxFreeBlockSize = Math.max(...freeBlocks.map(block => block.size));
    
    // 碎片化程度 = (总空闲内存 - 最大空闲块) / 总空闲内存
    const fragmentation = ((totalFreeMemory - maxFreeBlockSize) / totalFreeMemory) * 100;
    
    return Math.round(fragmentation * 100) / 100;
  };

  const memoryUsage = calculateMemoryUsage();
  const fragmentation = calculateFragmentation();

  // 生成内存块的颜色
  const getBlockColor = (block: MemoryBlock) => {
    if (!block.allocated) {
      return '#e0e0e0'; // 灰色表示空闲
    }
    
    // 为不同进程生成不同颜色
    const colors = [
      '#3880ff', '#10dc60', '#ffce00', '#f04141', 
      '#7044ff', '#00d4aa', '#ff6600', '#c0392b'
    ];
    
    const colorIndex = (block.processId || 0) % colors.length;
    return colors[colorIndex];
  };

  // 渲染内存条
  const renderMemoryBar = () => {
    return (
      <div className="memory-bar">
        {memoryBlocks.map(block => {
          const widthPercentage = (block.size / memorySize) * 100;
          return (
            <div
              key={block.id}
              className={`memory-block ${block.allocated ? 'memory-block-allocated' : 'memory-block-free'}`}
              style={{
                width: `${widthPercentage}%`,
                backgroundColor: getBlockColor(block)
              }}
              title={`${block.allocated ? `进程: ${block.processName}` : '空闲'} - ${block.size}KB`}
            >
              <div className="memory-block-info">
                {block.allocated ? (
                  <>
                    <div>{block.processName}</div>
                    <div className="memory-block-size">{block.size}KB</div>
                  </>
                ) : (
                  <div className="memory-block-size">{block.size}KB</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 渲染内存使用率指示器
  const renderUsageIndicator = () => {
    return (
      <div className="memory-usage-indicator">
        <div className="usage-bar">
          <div 
            className="usage-fill"
            style={{ width: `${memoryUsage.percentage}%` }}
          />
          <div className="usage-text">
            {memoryUsage.percentage}% 已使用
          </div>
        </div>
      </div>
    );
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>内存可视化</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {/* 内存使用率指示器 */}
        {renderUsageIndicator()}
        
        {/* 主内存条 */}
        <div className="memory-visualization">
          {renderMemoryBar()}
        </div>

        {/* 内存统计信息 */}
        <IonGrid>
          <IonRow>
            <IonCol size="6" sizeMd="3">
              <div className="stat-card">
                <div className="stat-value">{memoryUsage.allocated}KB</div>
                <div className="stat-label">已分配内存</div>
              </div>
            </IonCol>
            <IonCol size="6" sizeMd="3">
              <div className="stat-card">
                <div className="stat-value">{memoryUsage.free}KB</div>
                <div className="stat-label">空闲内存</div>
              </div>
            </IonCol>
            <IonCol size="6" sizeMd="3">
              <div className="stat-card">
                <div className="stat-value">{memoryBlocks.filter(b => !b.allocated).length}</div>
                <div className="stat-label">空闲块数</div>
              </div>
            </IonCol>
            <IonCol size="6" sizeMd="3">
              <div className="stat-card">
                <div className="stat-value">{fragmentation}%</div>
                <div className="stat-label">碎片化程度</div>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* 碎片化警告 */}
        {fragmentation > 50 && (
          <div className={`fragmentation-indicator ${fragmentation > 75 ? 'fragmentation-high' : ''}`}>
            <div className="fragmentation-title">
              ⚠️ 内存碎片化警告
            </div>
            <div className="fragmentation-info">
              当前碎片化程度为 {fragmentation}%，建议进行内存整理或使用不同的分配策略。
            </div>
          </div>
        )}

        {/* 内存块详细信息 */}
        <div className="memory-details">
          {memoryBlocks.map(block => (
            <div 
              key={block.id} 
              className={`memory-detail-card ${block.allocated ? 'memory-detail-allocated' : 'memory-detail-free'}`}
            >
              <div className="memory-detail-title">
                {block.allocated ? `进程: ${block.processName}` : '空闲块'}
              </div>
              <div className="memory-detail-info">
                起始地址: {block.start}KB<br/>
                大小: {block.size}KB<br/>
                结束地址: {block.start + block.size - 1}KB
              </div>
            </div>
          ))}
        </div>

        {/* 内存地址标尺 */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '8px' }}>
            内存地址 (KB)
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '0.8rem',
            color: 'var(--ion-color-medium)',
            borderTop: '1px solid var(--ion-color-light)',
            paddingTop: '4px'
          }}>
            <span>0</span>
            <span>{Math.floor(memorySize / 4)}</span>
            <span>{Math.floor(memorySize / 2)}</span>
            <span>{Math.floor(3 * memorySize / 4)}</span>
            <span>{memorySize}</span>
          </div>
        </div>

        {/* 图例 */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <IonChip color="primary">
            <IonLabel>已分配</IonLabel>
          </IonChip>
          <IonChip color="medium">
            <IonLabel>空闲</IonLabel>
          </IonChip>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default MemoryVisualization;
