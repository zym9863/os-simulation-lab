import React, { useState, useEffect } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonLabel,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { speedometer, time, checkmark, warning } from 'ionicons/icons';
import './PerformanceMonitor.css';

interface PerformanceMonitorProps {
  isActive: boolean;
  processCount?: number;
  memoryUsage?: number;
  operationCount?: number;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  isActive,
  processCount = 0,
  memoryUsage = 0,
  operationCount = 0
}) => {
  const [fps, setFps] = useState(0);
  const [lastTime, setLastTime] = useState(Date.now());
  const [frameCount, setFrameCount] = useState(0);
  const [status, setStatus] = useState<'good' | 'warning' | 'error'>('good');

  useEffect(() => {
    let animationId: number;
    
    const updateFPS = () => {
      const now = Date.now();
      setFrameCount(prev => prev + 1);
      
      if (now - lastTime >= 1000) {
        const currentFPS = Math.round((frameCount * 1000) / (now - lastTime));
        setFps(currentFPS);
        setFrameCount(0);
        setLastTime(now);
        
        // 根据FPS设置状态
        if (currentFPS >= 30) {
          setStatus('good');
        } else if (currentFPS >= 15) {
          setStatus('warning');
        } else {
          setStatus('error');
        }
      }
      
      if (isActive) {
        animationId = requestAnimationFrame(updateFPS);
      }
    };
    
    if (isActive) {
      animationId = requestAnimationFrame(updateFPS);
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isActive, lastTime, frameCount]);

  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'danger';
      default: return 'medium';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'good': return checkmark;
      case 'warning': return warning;
      case 'error': return warning;
      default: return speedometer;
    }
  };

  const getPerformanceLevel = () => {
    if (fps >= 30) return '优秀';
    if (fps >= 15) return '良好';
    if (fps >= 5) return '一般';
    return '较差';
  };

  return (
    <IonCard className="performance-monitor">
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={speedometer} style={{ marginRight: '8px' }} />
          性能监控
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol size="6" sizeMd="3">
              <div className="performance-metric">
                <IonChip color={getStatusColor()}>
                  <IonIcon icon={getStatusIcon()} />
                  <IonLabel>{fps} FPS</IonLabel>
                </IonChip>
                <div className="metric-label">帧率</div>
                <div className="metric-status">{getPerformanceLevel()}</div>
              </div>
            </IonCol>
            
            <IonCol size="6" sizeMd="3">
              <div className="performance-metric">
                <IonChip color="primary">
                  <IonIcon icon={time} />
                  <IonLabel>{processCount}</IonLabel>
                </IonChip>
                <div className="metric-label">进程数量</div>
                <div className="metric-status">
                  {processCount > 10 ? '较多' : processCount > 5 ? '适中' : '较少'}
                </div>
              </div>
            </IonCol>
            
            <IonCol size="6" sizeMd="3">
              <div className="performance-metric">
                <IonChip color="secondary">
                  <IonIcon icon={speedometer} />
                  <IonLabel>{memoryUsage.toFixed(1)}%</IonLabel>
                </IonChip>
                <div className="metric-label">内存使用率</div>
                <div className="metric-status">
                  {memoryUsage > 80 ? '高' : memoryUsage > 50 ? '中' : '低'}
                </div>
              </div>
            </IonCol>
            
            <IonCol size="6" sizeMd="3">
              <div className="performance-metric">
                <IonChip color="tertiary">
                  <IonIcon icon={checkmark} />
                  <IonLabel>{operationCount}</IonLabel>
                </IonChip>
                <div className="metric-label">操作次数</div>
                <div className="metric-status">
                  {isActive ? '运行中' : '已停止'}
                </div>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
        
        {/* 性能建议 */}
        {status !== 'good' && (
          <div className="performance-suggestions">
            <h4>性能建议</h4>
            {status === 'warning' && (
              <p>• 当前帧率较低，建议减少同时运行的进程数量或降低动画频率</p>
            )}
            {status === 'error' && (
              <p>• 性能严重下降，建议暂停模拟或刷新页面重新开始</p>
            )}
            {processCount > 15 && (
              <p>• 进程数量过多可能影响性能，建议控制在10个以内</p>
            )}
            {memoryUsage > 90 && (
              <p>• 内存使用率过高，建议释放一些已分配的内存块</p>
            )}
          </div>
        )}
        
        {/* 系统信息 */}
        <div className="system-info">
          <div className="info-item">
            <strong>浏览器:</strong> {navigator.userAgent.split(' ')[0]}
          </div>
          <div className="info-item">
            <strong>平台:</strong> {navigator.platform}
          </div>
          <div className="info-item">
            <strong>内存:</strong> {(navigator as any).deviceMemory ? `${(navigator as any).deviceMemory}GB` : '未知'}
          </div>
          <div className="info-item">
            <strong>CPU核心:</strong> {navigator.hardwareConcurrency || '未知'}
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default PerformanceMonitor;
