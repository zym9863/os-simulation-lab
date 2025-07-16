import { describe, it, expect } from 'vitest';

// 模拟进程接口
interface TestProcess {
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

// FCFS调度算法测试
function fcfsScheduling(processes: TestProcess[]): TestProcess[] {
  const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let currentTime = 0;
  
  return sortedProcesses.map(process => {
    const startTime = Math.max(currentTime, process.arrivalTime);
    const completionTime = startTime + process.burstTime;
    const turnaroundTime = completionTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;
    
    currentTime = completionTime;
    
    return {
      ...process,
      completionTime,
      turnaroundTime,
      waitingTime,
      state: 'completed' as const
    };
  });
}

// SJF调度算法测试
function sjfScheduling(processes: TestProcess[]): TestProcess[] {
  const result: TestProcess[] = [];
  const remaining = [...processes];
  let currentTime = 0;
  
  while (remaining.length > 0) {
    // 找到已到达且执行时间最短的进程
    const available = remaining.filter(p => p.arrivalTime <= currentTime);
    
    if (available.length === 0) {
      currentTime = Math.min(...remaining.map(p => p.arrivalTime));
      continue;
    }
    
    const shortest = available.reduce((min, current) => 
      current.burstTime < min.burstTime ? current : min
    );
    
    const startTime = Math.max(currentTime, shortest.arrivalTime);
    const completionTime = startTime + shortest.burstTime;
    const turnaroundTime = completionTime - shortest.arrivalTime;
    const waitingTime = turnaroundTime - shortest.burstTime;
    
    result.push({
      ...shortest,
      completionTime,
      turnaroundTime,
      waitingTime,
      state: 'completed'
    });
    
    currentTime = completionTime;
    remaining.splice(remaining.indexOf(shortest), 1);
  }
  
  return result;
}

// 内存分配算法测试
interface MemoryBlock {
  id: number;
  start: number;
  size: number;
  allocated: boolean;
}

function firstFitAllocation(blocks: MemoryBlock[], size: number): number {
  for (let i = 0; i < blocks.length; i++) {
    if (!blocks[i].allocated && blocks[i].size >= size) {
      return i;
    }
  }
  return -1;
}

function bestFitAllocation(blocks: MemoryBlock[], size: number): number {
  let bestIndex = -1;
  let bestSize = Infinity;
  
  for (let i = 0; i < blocks.length; i++) {
    if (!blocks[i].allocated && blocks[i].size >= size && blocks[i].size < bestSize) {
      bestIndex = i;
      bestSize = blocks[i].size;
    }
  }
  
  return bestIndex;
}

function worstFitAllocation(blocks: MemoryBlock[], size: number): number {
  let worstIndex = -1;
  let worstSize = -1;
  
  for (let i = 0; i < blocks.length; i++) {
    if (!blocks[i].allocated && blocks[i].size >= size && blocks[i].size > worstSize) {
      worstIndex = i;
      worstSize = blocks[i].size;
    }
  }
  
  return worstIndex;
}

describe('进程调度算法测试', () => {
  const testProcesses: TestProcess[] = [
    {
      id: 1, name: 'P1', arrivalTime: 0, burstTime: 8, priority: 3,
      remainingTime: 8, waitingTime: 0, turnaroundTime: 0, completionTime: 0, state: 'waiting'
    },
    {
      id: 2, name: 'P2', arrivalTime: 1, burstTime: 4, priority: 1,
      remainingTime: 4, waitingTime: 0, turnaroundTime: 0, completionTime: 0, state: 'waiting'
    },
    {
      id: 3, name: 'P3', arrivalTime: 2, burstTime: 9, priority: 4,
      remainingTime: 9, waitingTime: 0, turnaroundTime: 0, completionTime: 0, state: 'waiting'
    },
    {
      id: 4, name: 'P4', arrivalTime: 3, burstTime: 5, priority: 2,
      remainingTime: 5, waitingTime: 0, turnaroundTime: 0, completionTime: 0, state: 'waiting'
    }
  ];

  it('FCFS调度算法应该按到达时间顺序执行', () => {
    const result = fcfsScheduling(testProcesses);
    
    expect(result[0].name).toBe('P1');
    expect(result[0].completionTime).toBe(8);
    expect(result[0].waitingTime).toBe(0);
    
    expect(result[1].name).toBe('P2');
    expect(result[1].completionTime).toBe(12);
    expect(result[1].waitingTime).toBe(7);
  });

  it('SJF调度算法应该优先执行短作业', () => {
    const result = sjfScheduling(testProcesses);
    
    // 第一个执行的应该是P1（到达时间0，执行时间8）
    expect(result[0].name).toBe('P1');
    
    // 然后应该是P2（执行时间4，最短）
    expect(result[1].name).toBe('P2');
    
    // 接着是P4（执行时间5）
    expect(result[2].name).toBe('P4');
    
    // 最后是P3（执行时间9，最长）
    expect(result[3].name).toBe('P3');
  });

  it('应该正确计算平均等待时间', () => {
    const result = fcfsScheduling(testProcesses);
    const avgWaitingTime = result.reduce((sum, p) => sum + p.waitingTime, 0) / result.length;
    
    expect(avgWaitingTime).toBeGreaterThan(0);
    expect(avgWaitingTime).toBeLessThan(20); // 合理范围
  });
});

describe('内存分配算法测试', () => {
  const testBlocks: MemoryBlock[] = [
    { id: 1, start: 0, size: 100, allocated: false },
    { id: 2, start: 100, size: 500, allocated: false },
    { id: 3, start: 600, size: 200, allocated: false },
    { id: 4, start: 800, size: 300, allocated: false }
  ];

  it('First Fit应该选择第一个合适的块', () => {
    const index = firstFitAllocation(testBlocks, 150);
    expect(index).toBe(1); // 第二个块（大小500）
  });

  it('Best Fit应该选择最合适的块', () => {
    const index = bestFitAllocation(testBlocks, 150);
    expect(index).toBe(2); // 第三个块（大小200，最接近150）
  });

  it('Worst Fit应该选择最大的块', () => {
    const index = worstFitAllocation(testBlocks, 150);
    expect(index).toBe(1); // 第二个块（大小500，最大）
  });

  it('当没有合适的块时应该返回-1', () => {
    const index = firstFitAllocation(testBlocks, 1000);
    expect(index).toBe(-1);
  });
});

describe('性能指标计算测试', () => {
  const testProcesses: TestProcess[] = [
    {
      id: 1, name: 'P1', arrivalTime: 0, burstTime: 8, priority: 3,
      remainingTime: 8, waitingTime: 0, turnaroundTime: 0, completionTime: 0, state: 'waiting'
    },
    {
      id: 2, name: 'P2', arrivalTime: 1, burstTime: 4, priority: 1,
      remainingTime: 4, waitingTime: 0, turnaroundTime: 0, completionTime: 0, state: 'waiting'
    }
  ];

  it('应该正确计算吞吐量', () => {
    const processes = fcfsScheduling(testProcesses);
    const maxCompletionTime = Math.max(...processes.map(p => p.completionTime));
    const throughput = processes.length / maxCompletionTime;
    
    expect(throughput).toBeGreaterThan(0);
    expect(throughput).toBeLessThanOrEqual(1);
  });

  it('应该正确计算CPU利用率', () => {
    const processes = fcfsScheduling(testProcesses);
    const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
    const maxCompletionTime = Math.max(...processes.map(p => p.completionTime));
    const cpuUtilization = (totalBurstTime / maxCompletionTime) * 100;
    
    expect(cpuUtilization).toBeGreaterThan(0);
    expect(cpuUtilization).toBeLessThanOrEqual(100);
  });
});
