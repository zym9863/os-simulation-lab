import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonChip,
  IonBadge
} from '@ionic/react';
import { play, pause, refresh, add, arrowBack } from 'ionicons/icons';
import ProcessQueue from '../components/ProcessQueue';
import ProcessStatistics from '../components/ProcessStatistics';
import AlgorithmExplanation from '../components/AlgorithmExplanation';
import HelpGuide from '../components/HelpGuide';
import PerformanceMonitor from '../components/PerformanceMonitor';
import './ProcessScheduling.css';

export interface Process {
  id: number;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  remainingTime: number;
  waitingTime: number;
  turnaroundTime: number;
  completionTime: number;
  state: 'waiting' | 'running' | 'completed';
}

export type SchedulingAlgorithm = 'FCFS' | 'RR' | 'Priority' | 'SJF';

const ProcessScheduling: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [algorithm, setAlgorithm] = useState<SchedulingAlgorithm>('FCFS');
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [newProcess, setNewProcess] = useState({
    name: '',
    arrivalTime: 0,
    burstTime: 1,
    priority: 1
  });

  // 添加新进程
  const addProcess = () => {
    if (!newProcess.name.trim()) return;
    
    const process: Process = {
      id: Date.now(),
      name: newProcess.name,
      arrivalTime: newProcess.arrivalTime,
      burstTime: newProcess.burstTime,
      priority: newProcess.priority,
      remainingTime: newProcess.burstTime,
      waitingTime: 0,
      turnaroundTime: 0,
      completionTime: 0,
      state: 'waiting'
    };

    setProcesses(prev => [...prev, process]);
    setNewProcess({
      name: '',
      arrivalTime: 0,
      burstTime: 1,
      priority: 1
    });
  };

  // 重置模拟
  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setProcesses(prev => prev.map(p => ({
      ...p,
      remainingTime: p.burstTime,
      waitingTime: 0,
      turnaroundTime: 0,
      completionTime: 0,
      state: 'waiting' as const
    })));
  };

  // 清空所有进程
  const clearAllProcesses = () => {
    setProcesses([]);
    setCurrentTime(0);
    setIsRunning(false);
  };

  // 加载示例数据
  const loadExampleData = () => {
    const exampleProcesses: Process[] = [
      {
        id: 1,
        name: 'P1',
        arrivalTime: 0,
        burstTime: 8,
        priority: 3,
        remainingTime: 8,
        waitingTime: 0,
        turnaroundTime: 0,
        completionTime: 0,
        state: 'waiting'
      },
      {
        id: 2,
        name: 'P2',
        arrivalTime: 1,
        burstTime: 4,
        priority: 1,
        remainingTime: 4,
        waitingTime: 0,
        turnaroundTime: 0,
        completionTime: 0,
        state: 'waiting'
      },
      {
        id: 3,
        name: 'P3',
        arrivalTime: 2,
        burstTime: 9,
        priority: 4,
        remainingTime: 9,
        waitingTime: 0,
        turnaroundTime: 0,
        completionTime: 0,
        state: 'waiting'
      },
      {
        id: 4,
        name: 'P4',
        arrivalTime: 3,
        burstTime: 5,
        priority: 2,
        remainingTime: 5,
        waitingTime: 0,
        turnaroundTime: 0,
        completionTime: 0,
        state: 'waiting'
      }
    ];

    setProcesses(exampleProcesses);
    setCurrentTime(0);
    setIsRunning(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>进程调度可视化</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <div className="scheduling-container">
          {/* 控制面板 */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>调度控制面板</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel>调度算法</IonLabel>
                      <IonSelect
                        value={algorithm}
                        onSelectionChange={e => setAlgorithm(e.detail.value)}
                        disabled={isRunning}
                      >
                        <IonSelectOption value="FCFS">先来先服务 (FCFS)</IonSelectOption>
                        <IonSelectOption value="RR">时间片轮转 (RR)</IonSelectOption>
                        <IonSelectOption value="Priority">优先级调度</IonSelectOption>
                        <IonSelectOption value="SJF">短作业优先 (SJF)</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                  
                  {algorithm === 'RR' && (
                    <IonCol size="12" sizeMd="6">
                      <IonItem>
                        <IonLabel>时间片</IonLabel>
                        <IonInput
                          type="number"
                          value={timeQuantum}
                          onIonInput={e => setTimeQuantum(parseInt(e.detail.value!))}
                          disabled={isRunning}
                          min="1"
                        />
                      </IonItem>
                    </IonCol>
                  )}
                </IonRow>
                
                <IonRow>
                  <IonCol>
                    <div className="control-buttons">
                      <IonButton
                        onClick={() => setIsRunning(!isRunning)}
                        disabled={processes.length === 0}
                        color={isRunning ? 'warning' : 'primary'}
                      >
                        <IonIcon icon={isRunning ? pause : play} slot="start" />
                        {isRunning ? '暂停' : '开始'}
                      </IonButton>
                      
                      <IonButton onClick={resetSimulation} color="medium">
                        <IonIcon icon={refresh} slot="start" />
                        重置
                      </IonButton>
                      
                      <IonButton onClick={clearAllProcesses} color="danger" fill="outline">
                        清空所有
                      </IonButton>

                      <IonButton onClick={loadExampleData} color="tertiary" fill="outline">
                        加载示例
                      </IonButton>
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          {/* 当前时间显示 */}
          <div className="time-display">
            <IonChip color="primary">
              <IonLabel>当前时间: {currentTime}</IonLabel>
            </IonChip>
          </div>

          {/* 进程队列可视化 */}
          <ProcessQueue 
            processes={processes}
            algorithm={algorithm}
            currentTime={currentTime}
            timeQuantum={timeQuantum}
            isRunning={isRunning}
            onTimeUpdate={setCurrentTime}
            onProcessesUpdate={setProcesses}
          />

          {/* 添加新进程 */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>添加新进程</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="12" sizeMd="3">
                    <IonItem>
                      <IonLabel position="stacked">进程名称</IonLabel>
                      <IonInput
                        value={newProcess.name}
                        onIonInput={e => setNewProcess(prev => ({
                          ...prev,
                          name: e.detail.value!
                        }))}
                        placeholder="P1"
                      />
                    </IonItem>
                  </IonCol>
                  
                  <IonCol size="12" sizeMd="3">
                    <IonItem>
                      <IonLabel position="stacked">到达时间</IonLabel>
                      <IonInput
                        type="number"
                        value={newProcess.arrivalTime}
                        onIonInput={e => setNewProcess(prev => ({
                          ...prev,
                          arrivalTime: parseInt(e.detail.value!) || 0
                        }))}
                        min="0"
                      />
                    </IonItem>
                  </IonCol>
                  
                  <IonCol size="12" sizeMd="3">
                    <IonItem>
                      <IonLabel position="stacked">执行时间</IonLabel>
                      <IonInput
                        type="number"
                        value={newProcess.burstTime}
                        onIonInput={e => setNewProcess(prev => ({
                          ...prev,
                          burstTime: parseInt(e.detail.value!) || 1
                        }))}
                        min="1"
                      />
                    </IonItem>
                  </IonCol>
                  
                  <IonCol size="12" sizeMd="3">
                    <IonItem>
                      <IonLabel position="stacked">优先级</IonLabel>
                      <IonInput
                        type="number"
                        value={newProcess.priority}
                        onIonInput={e => setNewProcess(prev => ({
                          ...prev,
                          priority: parseInt(e.detail.value!) || 1
                        }))}
                        min="1"
                        max="10"
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
                
                <IonRow>
                  <IonCol>
                    <IonButton onClick={addProcess} expand="block">
                      <IonIcon icon={add} slot="start" />
                      添加进程
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          {/* 统计信息 */}
          <ProcessStatistics processes={processes} />

          {/* 算法说明 */}
          <AlgorithmExplanation type="scheduling" currentAlgorithm={algorithm} />

          {/* 使用指南 */}
          <HelpGuide type="scheduling" />

          {/* 性能监控 */}
          <PerformanceMonitor
            isActive={isRunning}
            processCount={processes.length}
            operationCount={currentTime}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProcessScheduling;
