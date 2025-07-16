import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonLabel,
  IonIcon
} from '@ionic/react';
import { informationCircle, time, layers, flash, refresh } from 'ionicons/icons';
import './AlgorithmExplanation.css';

interface AlgorithmExplanationProps {
  type: 'scheduling' | 'memory';
  currentAlgorithm?: string;
}

const AlgorithmExplanation: React.FC<AlgorithmExplanationProps> = ({ 
  type, 
  currentAlgorithm 
}) => {
  const schedulingAlgorithms = {
    FCFS: {
      name: '先来先服务 (First Come First Served)',
      description: '按照进程到达的先后顺序进行调度，最简单的调度算法。',
      advantages: ['实现简单', '公平性好', '无饥饿现象'],
      disadvantages: ['平均等待时间长', '不适合交互式系统', '护航效应'],
      timeComplexity: 'O(n)',
      icon: time
    },
    RR: {
      name: '时间片轮转 (Round Robin)',
      description: '为每个进程分配固定的时间片，时间片用完后切换到下一个进程。',
      advantages: ['响应时间好', '适合分时系统', '公平性好'],
      disadvantages: ['上下文切换开销', '时间片选择困难', '平均周转时间可能较长'],
      timeComplexity: 'O(1)',
      icon: refresh
    },
    Priority: {
      name: '优先级调度 (Priority Scheduling)',
      description: '根据进程的优先级进行调度，优先级高的进程先执行。',
      advantages: ['重要进程优先执行', '灵活性好', '适合实时系统'],
      disadvantages: ['可能产生饥饿现象', '优先级设置困难', '不够公平'],
      timeComplexity: 'O(log n)',
      icon: flash
    },
    SJF: {
      name: '短作业优先 (Shortest Job First)',
      description: '优先调度执行时间最短的进程，可以最小化平均等待时间。',
      advantages: ['平均等待时间最短', '吞吐量高', '理论最优'],
      disadvantages: ['长进程可能饥饿', '难以预测执行时间', '不适合交互式系统'],
      timeComplexity: 'O(log n)',
      icon: time
    }
  };

  const memoryAlgorithms = {
    FirstFit: {
      name: '首次适应 (First Fit)',
      description: '从内存开始处查找，分配第一个足够大的空闲块。',
      advantages: ['实现简单', '分配速度快', '内存利用率较好'],
      disadvantages: ['容易产生小碎片', '大块被分割', '搜索效率一般'],
      timeComplexity: 'O(n)',
      icon: layers
    },
    BestFit: {
      name: '最佳适应 (Best Fit)',
      description: '选择大小最接近请求大小的空闲块进行分配。',
      advantages: ['内存利用率高', '减少大块浪费', '适合大小差异大的请求'],
      disadvantages: ['搜索时间长', '产生很多小碎片', '实现复杂'],
      timeComplexity: 'O(n)',
      icon: layers
    },
    WorstFit: {
      name: '最坏适应 (Worst Fit)',
      description: '选择最大的空闲块进行分配，留下较大的剩余空间。',
      advantages: ['剩余块较大', '减少外部碎片', '后续分配成功率高'],
      disadvantages: ['内存利用率低', '搜索时间长', '大块快速消耗'],
      timeComplexity: 'O(n)',
      icon: layers
    }
  };

  const algorithms = type === 'scheduling' ? schedulingAlgorithms : memoryAlgorithms;

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={informationCircle} style={{ marginRight: '8px' }} />
          算法说明
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonAccordionGroup>
          {Object.entries(algorithms).map(([key, algorithm]) => (
            <IonAccordion 
              key={key} 
              value={key}
              className={currentAlgorithm === key ? 'current-algorithm' : ''}
            >
              <IonItem slot="header">
                <IonIcon icon={algorithm.icon} slot="start" />
                <IonLabel>
                  <h3>{algorithm.name}</h3>
                  <p>时间复杂度: {algorithm.timeComplexity}</p>
                </IonLabel>
                {currentAlgorithm === key && (
                  <IonIcon 
                    icon={flash} 
                    color="primary" 
                    style={{ marginLeft: '8px' }}
                  />
                )}
              </IonItem>
              
              <div slot="content" className="algorithm-content">
                <div className="algorithm-description">
                  <h4>算法描述</h4>
                  <p>{algorithm.description}</p>
                </div>
                
                <div className="algorithm-pros-cons">
                  <div className="pros">
                    <h4 style={{ color: 'var(--ion-color-success)' }}>优点</h4>
                    <ul>
                      {algorithm.advantages.map((advantage, index) => (
                        <li key={index}>{advantage}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="cons">
                    <h4 style={{ color: 'var(--ion-color-danger)' }}>缺点</h4>
                    <ul>
                      {algorithm.disadvantages.map((disadvantage, index) => (
                        <li key={index}>{disadvantage}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {type === 'scheduling' && key === 'RR' && (
                  <div className="algorithm-note">
                    <h4>时间片选择建议</h4>
                    <p>
                      • 时间片过小：上下文切换开销大<br/>
                      • 时间片过大：退化为FCFS<br/>
                      • 建议：10-100ms，根据系统特性调整
                    </p>
                  </div>
                )}
                
                {type === 'memory' && (
                  <div className="algorithm-note">
                    <h4>适用场景</h4>
                    <p>
                      {key === 'FirstFit' && '适合内存请求大小相近的场景'}
                      {key === 'BestFit' && '适合内存请求大小差异较大的场景'}
                      {key === 'WorstFit' && '适合需要预留较大连续空间的场景'}
                    </p>
                  </div>
                )}
              </div>
            </IonAccordion>
          ))}
        </IonAccordionGroup>
        
        {type === 'scheduling' && (
          <div className="general-tips">
            <h4>调度算法选择建议</h4>
            <div className="tips-grid">
              <div className="tip-item">
                <strong>批处理系统：</strong> FCFS, SJF
              </div>
              <div className="tip-item">
                <strong>分时系统：</strong> RR
              </div>
              <div className="tip-item">
                <strong>实时系统：</strong> Priority
              </div>
              <div className="tip-item">
                <strong>通用系统：</strong> 多级队列调度
              </div>
            </div>
          </div>
        )}
        
        {type === 'memory' && (
          <div className="general-tips">
            <h4>内存分配策略建议</h4>
            <div className="tips-grid">
              <div className="tip-item">
                <strong>快速分配：</strong> First Fit
              </div>
              <div className="tip-item">
                <strong>节省内存：</strong> Best Fit
              </div>
              <div className="tip-item">
                <strong>减少碎片：</strong> Worst Fit
              </div>
              <div className="tip-item">
                <strong>现代系统：</strong> 分页/分段
              </div>
            </div>
          </div>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default AlgorithmExplanation;
