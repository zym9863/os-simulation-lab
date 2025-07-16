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
  IonList,
  IonAlert
} from '@ionic/react';
import { add, refresh, trash, arrowBack } from 'ionicons/icons';
import MemoryVisualization from '../components/MemoryVisualization';
import AllocationStatistics from '../components/AllocationStatistics';
import AlgorithmExplanation from '../components/AlgorithmExplanation';
import HelpGuide from '../components/HelpGuide';
import PerformanceMonitor from '../components/PerformanceMonitor';
import './MemoryAllocation.css';

export interface MemoryBlock {
  id: number;
  start: number;
  size: number;
  processId?: number;
  processName?: string;
  allocated: boolean;
}

export interface AllocationRequest {
  id: number;
  processName: string;
  size: number;
  allocated: boolean;
  blockId?: number;
}

export type AllocationAlgorithm = 'FirstFit' | 'BestFit' | 'WorstFit';

const MemoryAllocation: React.FC = () => {
  const [memorySize] = useState(1024); // 总内存大小 (KB)
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlock[]>([]);
  const [allocationRequests, setAllocationRequests] = useState<AllocationRequest[]>([]);
  const [algorithm, setAlgorithm] = useState<AllocationAlgorithm>('FirstFit');
  const [newRequest, setNewRequest] = useState({
    processName: '',
    size: 64
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // 初始化内存
  useEffect(() => {
    initializeMemory();
  }, []);

  const initializeMemory = () => {
    const initialBlock: MemoryBlock = {
      id: 1,
      start: 0,
      size: memorySize,
      allocated: false
    };
    setMemoryBlocks([initialBlock]);
    setAllocationRequests([]);
  };

  // 添加分配请求
  const addAllocationRequest = () => {
    if (!newRequest.processName.trim() || newRequest.size <= 0) {
      setAlertMessage('请输入有效的进程名称和内存大小');
      setShowAlert(true);
      return;
    }

    if (newRequest.size > memorySize) {
      setAlertMessage('请求的内存大小超过了总内存大小');
      setShowAlert(true);
      return;
    }

    const request: AllocationRequest = {
      id: Date.now(),
      processName: newRequest.processName,
      size: newRequest.size,
      allocated: false
    };

    // 尝试分配内存
    const result = allocateMemory(request);
    
    if (result.success) {
      setAllocationRequests(prev => [...prev, { ...request, allocated: true, blockId: result.blockId }]);
      if (result.newBlocks) {
        setMemoryBlocks(result.newBlocks);
      }
      setAlertMessage(`成功为进程 ${request.processName} 分配了 ${request.size}KB 内存`);
    } else {
      setAllocationRequests(prev => [...prev, request]);
      setAlertMessage(`无法为进程 ${request.processName} 分配 ${request.size}KB 内存：${result.reason}`);
    }
    
    setShowAlert(true);
    setNewRequest({ processName: '', size: 64 });
  };

  // 内存分配算法
  const allocateMemory = (request: AllocationRequest): { 
    success: boolean; 
    blockId?: number; 
    newBlocks?: MemoryBlock[]; 
    reason?: string 
  } => {
    const freeBlocks = memoryBlocks.filter(block => !block.allocated);
    
    if (freeBlocks.length === 0) {
      return { success: false, reason: '没有可用的空闲内存块' };
    }

    let selectedBlock: MemoryBlock | null = null;

    switch (algorithm) {
      case 'FirstFit':
        selectedBlock = freeBlocks.find(block => block.size >= request.size) || null;
        break;
        
      case 'BestFit':
        const suitableBlocks = freeBlocks.filter(block => block.size >= request.size);
        if (suitableBlocks.length > 0) {
          selectedBlock = suitableBlocks.reduce((best, current) => 
            current.size < best.size ? current : best
          );
        }
        break;
        
      case 'WorstFit':
        const largeEnoughBlocks = freeBlocks.filter(block => block.size >= request.size);
        if (largeEnoughBlocks.length > 0) {
          selectedBlock = largeEnoughBlocks.reduce((worst, current) => 
            current.size > worst.size ? current : worst
          );
        }
        break;
    }

    if (!selectedBlock) {
      return { success: false, reason: '没有足够大的空闲内存块' };
    }

    // 分割内存块
    const newBlocks = [...memoryBlocks];
    const blockIndex = newBlocks.findIndex(block => block.id === selectedBlock!.id);
    
    // 创建已分配的块
    const allocatedBlock: MemoryBlock = {
      id: Date.now(),
      start: selectedBlock.start,
      size: request.size,
      processId: request.id,
      processName: request.processName,
      allocated: true
    };

    newBlocks[blockIndex] = allocatedBlock;

    // 如果有剩余空间，创建新的空闲块
    if (selectedBlock.size > request.size) {
      const remainingBlock: MemoryBlock = {
        id: Date.now() + 1,
        start: selectedBlock.start + request.size,
        size: selectedBlock.size - request.size,
        allocated: false
      };
      newBlocks.splice(blockIndex + 1, 0, remainingBlock);
    }

    return { success: true, blockId: allocatedBlock.id, newBlocks };
  };

  // 释放内存
  const deallocateMemory = (requestId: number) => {
    const request = allocationRequests.find(req => req.id === requestId);
    if (!request || !request.allocated) return;

    // 找到对应的内存块并释放
    const newBlocks = memoryBlocks.map(block => {
      if (block.processId === requestId) {
        return {
          ...block,
          processId: undefined,
          processName: undefined,
          allocated: false
        };
      }
      return block;
    });

    // 合并相邻的空闲块
    const mergedBlocks = mergeAdjacentFreeBlocks(newBlocks);
    
    setMemoryBlocks(mergedBlocks);
    setAllocationRequests(prev => prev.filter(req => req.id !== requestId));
    
    setAlertMessage(`已释放进程 ${request.processName} 的内存`);
    setShowAlert(true);
  };

  // 合并相邻的空闲块
  const mergeAdjacentFreeBlocks = (blocks: MemoryBlock[]): MemoryBlock[] => {
    const sortedBlocks = [...blocks].sort((a, b) => a.start - b.start);
    const merged: MemoryBlock[] = [];

    for (const block of sortedBlocks) {
      if (merged.length === 0) {
        merged.push(block);
        continue;
      }

      const lastBlock = merged[merged.length - 1];
      
      // 如果当前块和上一个块都是空闲的且相邻，则合并
      if (!lastBlock.allocated && !block.allocated && 
          lastBlock.start + lastBlock.size === block.start) {
        lastBlock.size += block.size;
      } else {
        merged.push(block);
      }
    }

    return merged;
  };

  // 重置内存
  const resetMemory = () => {
    initializeMemory();
  };

  // 加载示例数据
  const loadExampleData = () => {
    // 重置内存
    initializeMemory();

    // 添加一些示例分配请求
    const exampleRequests = [
      { processName: 'System', size: 128 },
      { processName: 'Browser', size: 256 },
      { processName: 'Editor', size: 64 },
      { processName: 'Player', size: 192 }
    ];

    let currentBlocks = [{
      id: 1,
      start: 0,
      size: memorySize,
      allocated: false
    }];

    const successfulRequests: AllocationRequest[] = [];

    exampleRequests.forEach((req, index) => {
      const request: AllocationRequest = {
        id: Date.now() + index,
        processName: req.processName,
        size: req.size,
        allocated: false
      };

      const result = allocateMemoryForExample(request, currentBlocks);
      if (result.success) {
        successfulRequests.push({ ...request, allocated: true, blockId: result.blockId });
        currentBlocks = result.newBlocks!;
      }
    });

    setMemoryBlocks(currentBlocks);
    setAllocationRequests(successfulRequests);
  };

  // 示例数据的内存分配函数
  const allocateMemoryForExample = (request: AllocationRequest, blocks: MemoryBlock[]): {
    success: boolean;
    blockId?: number;
    newBlocks?: MemoryBlock[];
  } => {
    const freeBlocks = blocks.filter(block => !block.allocated);
    const selectedBlock = freeBlocks.find(block => block.size >= request.size);

    if (!selectedBlock) {
      return { success: false };
    }

    const newBlocks = [...blocks];
    const blockIndex = newBlocks.findIndex(block => block.id === selectedBlock.id);

    const allocatedBlock: MemoryBlock = {
      id: Date.now() + Math.random(),
      start: selectedBlock.start,
      size: request.size,
      processId: request.id,
      processName: request.processName,
      allocated: true
    };

    newBlocks[blockIndex] = allocatedBlock;

    if (selectedBlock.size > request.size) {
      const remainingBlock: MemoryBlock = {
        id: Date.now() + Math.random() + 1,
        start: selectedBlock.start + request.size,
        size: selectedBlock.size - request.size,
        allocated: false
      };
      newBlocks.splice(blockIndex + 1, 0, remainingBlock);
    }

    return { success: true, blockId: allocatedBlock.id, newBlocks };
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" />
          </IonButtons>
          <IonTitle>内存分配模拟</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <div className="memory-container">
          {/* 控制面板 */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>分配控制面板</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel>分配算法</IonLabel>
                      <IonSelect
                        value={algorithm}
                        onIonChange={e => setAlgorithm(e.detail.value)}
                      >
                        <IonSelectOption value="FirstFit">首次适应 (First Fit)</IonSelectOption>
                        <IonSelectOption value="BestFit">最佳适应 (Best Fit)</IonSelectOption>
                        <IonSelectOption value="WorstFit">最坏适应 (Worst Fit)</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                  
                  <IonCol size="12" sizeMd="6">
                    <div className="memory-info">
                      <IonChip color="primary">
                        <IonLabel>总内存: {memorySize}KB</IonLabel>
                      </IonChip>
                      <IonChip color="success">
                        <IonLabel>
                          已用: {memoryBlocks
                            .filter(block => block.allocated)
                            .reduce((sum, block) => sum + block.size, 0)}KB
                        </IonLabel>
                      </IonChip>
                      <IonChip color="medium">
                        <IonLabel>
                          空闲: {memoryBlocks
                            .filter(block => !block.allocated)
                            .reduce((sum, block) => sum + block.size, 0)}KB
                        </IonLabel>
                      </IonChip>
                    </div>
                  </IonCol>
                </IonRow>
                
                <IonRow>
                  <IonCol>
                    <IonButton onClick={resetMemory} color="medium">
                      <IonIcon icon={refresh} slot="start" />
                      重置内存
                    </IonButton>

                    <IonButton onClick={loadExampleData} color="tertiary" fill="outline">
                      加载示例
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          {/* 内存可视化 */}
          <MemoryVisualization 
            memoryBlocks={memoryBlocks}
            memorySize={memorySize}
          />

          {/* 添加分配请求 */}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>内存分配请求</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">进程名称</IonLabel>
                      <IonInput
                        value={newRequest.processName}
                        onIonInput={e => setNewRequest(prev => ({
                          ...prev,
                          processName: e.detail.value!
                        }))}
                        placeholder="Process1"
                      />
                    </IonItem>
                  </IonCol>
                  
                  <IonCol size="12" sizeMd="6">
                    <IonItem>
                      <IonLabel position="stacked">内存大小 (KB)</IonLabel>
                      <IonInput
                        type="number"
                        value={newRequest.size}
                        onIonInput={e => setNewRequest(prev => ({
                          ...prev,
                          size: parseInt(e.detail.value!) || 64
                        }))}
                        min="1"
                        max={memorySize}
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>
                
                <IonRow>
                  <IonCol>
                    <IonButton onClick={addAllocationRequest} expand="block">
                      <IonIcon icon={add} slot="start" />
                      请求内存分配
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>

          {/* 已分配进程列表 */}
          {allocationRequests.filter(req => req.allocated).length > 0 && (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>已分配进程</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  {allocationRequests
                    .filter(req => req.allocated)
                    .map(request => (
                      <IonItem key={request.id}>
                        <IonLabel>
                          <h3>{request.processName}</h3>
                          <p>大小: {request.size}KB</p>
                        </IonLabel>
                        <IonButton
                          fill="clear"
                          color="danger"
                          onClick={() => deallocateMemory(request.id)}
                        >
                          <IonIcon icon={trash} />
                        </IonButton>
                      </IonItem>
                    ))}
                </IonList>
              </IonCardContent>
            </IonCard>
          )}

          {/* 统计信息 */}
          <AllocationStatistics
            memoryBlocks={memoryBlocks}
            allocationRequests={allocationRequests}
            memorySize={memorySize}
          />

          {/* 算法说明 */}
          <AlgorithmExplanation type="memory" currentAlgorithm={algorithm} />

          {/* 使用指南 */}
          <HelpGuide type="memory" />

          {/* 性能监控 */}
          <PerformanceMonitor
            isActive={allocationRequests.length > 0}
            processCount={allocationRequests.filter(req => req.allocated).length}
            memoryUsage={(memoryBlocks
              .filter(block => block.allocated)
              .reduce((sum, block) => sum + block.size, 0) / memorySize) * 100}
            operationCount={allocationRequests.length}
          />
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="提示"
          message={alertMessage}
          buttons={['确定']}
        />
      </IonContent>
    </IonPage>
  );
};

export default MemoryAllocation;
