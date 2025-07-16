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
import { Process } from '../pages/ProcessScheduling';

interface ProcessStatisticsProps {
  processes: Process[];
}

const ProcessStatistics: React.FC<ProcessStatisticsProps> = ({ processes }) => {
  const completedProcesses = processes.filter(p => p.state === 'completed');
  
  const calculateAverages = () => {
    if (completedProcesses.length === 0) {
      return {
        avgWaitingTime: 0,
        avgTurnaroundTime: 0,
        throughput: 0,
        cpuUtilization: 0
      };
    }

    const totalWaitingTime = completedProcesses.reduce((sum, p) => sum + p.waitingTime, 0);
    const totalTurnaroundTime = completedProcesses.reduce((sum, p) => sum + p.turnaroundTime, 0);
    const avgWaitingTime = totalWaitingTime / completedProcesses.length;
    const avgTurnaroundTime = totalTurnaroundTime / completedProcesses.length;
    
    // 计算吞吐量（每单位时间完成的进程数）
    const maxCompletionTime = Math.max(...completedProcesses.map(p => p.completionTime));
    const throughput = maxCompletionTime > 0 ? completedProcesses.length / maxCompletionTime : 0;
    
    // 计算CPU利用率
    const totalBurstTime = completedProcesses.reduce((sum, p) => sum + p.burstTime, 0);
    const cpuUtilization = maxCompletionTime > 0 ? (totalBurstTime / maxCompletionTime) * 100 : 0;

    return {
      avgWaitingTime: Math.round(avgWaitingTime * 100) / 100,
      avgTurnaroundTime: Math.round(avgTurnaroundTime * 100) / 100,
      throughput: Math.round(throughput * 100) / 100,
      cpuUtilization: Math.round(cpuUtilization * 100) / 100
    };
  };

  const stats = calculateAverages();

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>统计信息</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {/* 总体统计 */}
        <IonGrid>
          <IonRow>
            <IonCol size="6" sizeMd="3">
              <div className="stat-card">
                <div className="stat-value">{stats.avgWaitingTime}</div>
                <div className="stat-label">平均等待时间</div>
              </div>
            </IonCol>
            <IonCol size="6" sizeMd="3">
              <div className="stat-card">
                <div className="stat-value">{stats.avgTurnaroundTime}</div>
                <div className="stat-label">平均周转时间</div>
              </div>
            </IonCol>
            <IonCol size="6" sizeMd="3">
              <div className="stat-card">
                <div className="stat-value">{stats.throughput}</div>
                <div className="stat-label">吞吐量</div>
              </div>
            </IonCol>
            <IonCol size="6" sizeMd="3">
              <div className="stat-card">
                <div className="stat-value">{stats.cpuUtilization}%</div>
                <div className="stat-label">CPU利用率</div>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* 进程详细信息表格 */}
        {processes.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <h3>进程详细信息</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="statistics-table">
                <thead>
                  <tr>
                    <th>进程名</th>
                    <th>到达时间</th>
                    <th>执行时间</th>
                    <th>优先级</th>
                    <th>完成时间</th>
                    <th>周转时间</th>
                    <th>等待时间</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map(process => (
                    <tr key={process.id}>
                      <td>{process.name}</td>
                      <td>{process.arrivalTime}</td>
                      <td>{process.burstTime}</td>
                      <td>{process.priority}</td>
                      <td>
                        {process.state === 'completed' ? process.completionTime : '-'}
                      </td>
                      <td>
                        {process.state === 'completed' ? process.turnaroundTime : '-'}
                      </td>
                      <td>
                        {process.state === 'completed' ? process.waitingTime : '-'}
                      </td>
                      <td>
                        <IonChip 
                          color={
                            process.state === 'completed' ? 'primary' :
                            process.state === 'running' ? 'success' : 'medium'
                          }
                        >
                          <IonLabel>
                            {process.state === 'completed' ? '已完成' :
                             process.state === 'running' ? '运行中' : '等待中'}
                          </IonLabel>
                        </IonChip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 算法性能分析 */}
        {completedProcesses.length > 0 && (
          <div style={{ marginTop: '24px' }}>
            <h3>性能分析</h3>
            <div className="performance-analysis">
              <div className="analysis-item">
                <strong>等待时间分析：</strong>
                <span style={{ marginLeft: '8px' }}>
                  {stats.avgWaitingTime < 5 ? '优秀' : 
                   stats.avgWaitingTime < 10 ? '良好' : '需要优化'}
                </span>
              </div>
              <div className="analysis-item" style={{ marginTop: '8px' }}>
                <strong>CPU利用率分析：</strong>
                <span style={{ marginLeft: '8px' }}>
                  {stats.cpuUtilization > 80 ? '高效' : 
                   stats.cpuUtilization > 60 ? '中等' : '低效'}
                </span>
              </div>
              <div className="analysis-item" style={{ marginTop: '8px' }}>
                <strong>吞吐量分析：</strong>
                <span style={{ marginLeft: '8px' }}>
                  {stats.throughput > 0.5 ? '高' : 
                   stats.throughput > 0.2 ? '中' : '低'}
                </span>
              </div>
            </div>
          </div>
        )}

        {processes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ion-color-medium)' }}>
            <p>暂无进程数据</p>
            <p>请添加进程开始模拟</p>
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default ProcessStatistics;
