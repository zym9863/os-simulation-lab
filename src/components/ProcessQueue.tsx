import React, { useEffect, useRef } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { Process, SchedulingAlgorithm } from '../pages/ProcessScheduling';

interface ProcessQueueProps {
  processes: Process[];
  algorithm: SchedulingAlgorithm;
  currentTime: number;
  timeQuantum: number;
  isRunning: boolean;
  onTimeUpdate: (time: number) => void;
  onProcessesUpdate: (processes: Process[]) => void;
}

const ProcessQueue: React.FC<ProcessQueueProps> = ({
  processes,
  algorithm,
  currentTime,
  timeQuantum,
  isRunning,
  onTimeUpdate,
  onProcessesUpdate
}) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeSliceRef = useRef(0);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        simulateScheduling();
      }, 1000); // 每秒执行一次
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, processes, algorithm, currentTime, timeQuantum]);

  const simulateScheduling = () => {
    try {
      const newProcesses = [...processes];
      let newTime = currentTime + 1;
    
    // 检查是否有新进程到达
    newProcesses.forEach(process => {
      if (process.arrivalTime === newTime && process.state === 'waiting') {
        // 进程到达，但状态保持waiting直到被调度
      }
    });

    // 获取可调度的进程（已到达且未完成）
    const availableProcesses = newProcesses.filter(
      p => p.arrivalTime <= newTime && p.state !== 'completed'
    );

    if (availableProcesses.length === 0) {
      onTimeUpdate(newTime);
      return;
    }

    // 根据算法选择下一个要执行的进程
    const nextProcess = selectNextProcess(availableProcesses, algorithm);
    
    if (nextProcess) {
      // 设置当前运行的进程
      newProcesses.forEach(p => {
        if (p.id === nextProcess.id) {
          p.state = 'running';
          p.remainingTime = Math.max(0, p.remainingTime - 1);
          
          // 检查进程是否完成
          if (p.remainingTime === 0) {
            p.state = 'completed';
            p.completionTime = newTime;
            p.turnaroundTime = p.completionTime - p.arrivalTime;
            p.waitingTime = p.turnaroundTime - p.burstTime;
            timeSliceRef.current = 0; // 重置时间片
          } else if (algorithm === 'RR') {
            timeSliceRef.current++;
            // 时间片轮转：检查时间片是否用完
            if (timeSliceRef.current >= timeQuantum) {
              p.state = 'waiting';
              timeSliceRef.current = 0;
            }
          }
        } else if (p.state === 'running') {
          // 其他正在运行的进程设为等待
          p.state = 'waiting';
        }
      });

      // 更新等待时间
      newProcesses.forEach(p => {
        if (p.arrivalTime <= newTime && p.state === 'waiting' && p.remainingTime > 0) {
          p.waitingTime++;
        }
      });
    }

      onProcessesUpdate(newProcesses);
      onTimeUpdate(newTime);
    } catch (error) {
      console.error('调度模拟出错:', error);
      // 在出错时停止模拟
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const selectNextProcess = (availableProcesses: Process[], algorithm: SchedulingAlgorithm): Process | null => {
    if (availableProcesses.length === 0) return null;

    switch (algorithm) {
      case 'FCFS':
        // 先来先服务：按到达时间排序
        return availableProcesses
          .filter(p => p.remainingTime > 0)
          .sort((a, b) => a.arrivalTime - b.arrivalTime)[0] || null;

      case 'SJF':
        // 短作业优先：按剩余时间排序
        return availableProcesses
          .filter(p => p.remainingTime > 0)
          .sort((a, b) => a.remainingTime - b.remainingTime)[0] || null;

      case 'Priority':
        // 优先级调度：按优先级排序（数字越小优先级越高）
        return availableProcesses
          .filter(p => p.remainingTime > 0)
          .sort((a, b) => a.priority - b.priority)[0] || null;

      case 'RR':
        // 时间片轮转：如果当前有正在运行的进程且时间片未用完，继续执行
        const runningProcess = availableProcesses.find(p => p.state === 'running');
        if (runningProcess && timeSliceRef.current < timeQuantum && runningProcess.remainingTime > 0) {
          return runningProcess;
        }
        
        // 否则选择下一个等待的进程
        const waitingProcesses = availableProcesses.filter(p => p.remainingTime > 0 && p.state !== 'running');
        if (waitingProcesses.length > 0) {
          // 按到达时间排序，选择最早到达的
          return waitingProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime)[0];
        }
        return null;

      default:
        return null;
    }
  };

  const getReadyQueue = () => {
    return processes.filter(p => 
      p.arrivalTime <= currentTime && 
      p.state === 'waiting' && 
      p.remainingTime > 0
    );
  };

  const getRunningProcess = () => {
    return processes.find(p => p.state === 'running');
  };

  const getCompletedProcesses = () => {
    return processes.filter(p => p.state === 'completed');
  };

  const renderProcessChip = (process: Process) => (
    <IonChip key={process.id} className={`process-${process.state}`}>
      <IonLabel>
        {process.name} ({process.remainingTime}/{process.burstTime})
      </IonLabel>
    </IonChip>
  );

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>进程调度可视化</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="4">
              <div className="queue-container">
                <div className="queue-title">就绪队列</div>
                <div className="queue-items">
                  {getReadyQueue().length > 0 ? (
                    getReadyQueue().map(renderProcessChip)
                  ) : (
                    <div className="queue-empty">队列为空</div>
                  )}
                </div>
              </div>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <div className="cpu-container">
                <div className="queue-title">CPU</div>
                <div className={`cpu-visual ${!getRunningProcess() ? 'cpu-idle' : ''}`}>
                  {getRunningProcess() ? (
                    <div>
                      <div>{getRunningProcess()!.name}</div>
                      <div style={{ fontSize: '0.8rem' }}>
                        {getRunningProcess()!.remainingTime}/{getRunningProcess()!.burstTime}
                      </div>
                    </div>
                  ) : (
                    '空闲'
                  )}
                </div>
                {algorithm === 'RR' && getRunningProcess() && (
                  <div style={{ marginTop: '8px', fontSize: '0.9rem' }}>
                    时间片: {timeSliceRef.current}/{timeQuantum}
                  </div>
                )}
              </div>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <div className="queue-container">
                <div className="queue-title">已完成</div>
                <div className="queue-items">
                  {getCompletedProcesses().length > 0 ? (
                    getCompletedProcesses().map(renderProcessChip)
                  ) : (
                    <div className="queue-empty">无已完成进程</div>
                  )}
                </div>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>

        {/* 甘特图 */}
        <div className="gantt-chart">
          <div className="queue-title">执行时间线</div>
          <div className="gantt-timeline">
            {Array.from({ length: Math.max(currentTime, 20) }, (_, i) => {
              const processAtTime = processes.find(p => 
                p.arrivalTime <= i && 
                p.completionTime > i && 
                p.state !== 'waiting'
              );
              
              return (
                <div
                  key={i}
                  className="gantt-block"
                  style={{
                    flex: 1,
                    backgroundColor: processAtTime 
                      ? processAtTime.state === 'completed' 
                        ? 'var(--ion-color-primary)' 
                        : 'var(--ion-color-success)'
                      : 'var(--ion-color-light)',
                    color: processAtTime ? 'white' : 'var(--ion-color-medium)'
                  }}
                >
                  {processAtTime ? processAtTime.name : ''}
                </div>
              );
            })}
          </div>
          <div className="gantt-time-labels">
            {Array.from({ length: Math.max(currentTime, 20) }, (_, i) => (
              <div key={i} className="gantt-time-label">
                {i}
              </div>
            ))}
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default ProcessQueue;
