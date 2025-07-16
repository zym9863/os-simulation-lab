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
  IonIcon,
  IonChip,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { 
  helpCircle, 
  play, 
  add, 
  settings, 
  analytics,
  cpu,
  layers,
  refresh
} from 'ionicons/icons';
import './HelpGuide.css';

interface HelpGuideProps {
  type: 'scheduling' | 'memory';
}

const HelpGuide: React.FC<HelpGuideProps> = ({ type }) => {
  const schedulingSteps = [
    {
      title: '选择调度算法',
      description: '在控制面板中选择要模拟的调度算法（FCFS、RR、Priority、SJF）',
      icon: settings
    },
    {
      title: '添加进程',
      description: '填写进程名称、到达时间、执行时间和优先级，点击"添加进程"',
      icon: add
    },
    {
      title: '开始模拟',
      description: '点击"开始"按钮启动调度模拟，观察进程在队列中的变化',
      icon: play
    },
    {
      title: '查看统计',
      description: '在统计信息中查看平均等待时间、周转时间等性能指标',
      icon: analytics
    }
  ];

  const memorySteps = [
    {
      title: '选择分配算法',
      description: '在控制面板中选择内存分配算法（First Fit、Best Fit、Worst Fit）',
      icon: settings
    },
    {
      title: '请求内存分配',
      description: '输入进程名称和所需内存大小，点击"请求内存分配"',
      icon: add
    },
    {
      title: '观察内存状态',
      description: '在内存可视化中观察内存块的分配情况和碎片化程度',
      icon: layers
    },
    {
      title: '释放内存',
      description: '在已分配进程列表中点击删除按钮释放内存，观察内存合并',
      icon: refresh
    }
  ];

  const steps = type === 'scheduling' ? schedulingSteps : memorySteps;

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={helpCircle} style={{ marginRight: '8px' }} />
          使用指南
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonAccordionGroup>
          <IonAccordion value="quick-start">
            <IonItem slot="header">
              <IonIcon icon={play} slot="start" />
              <IonLabel>
                <h3>快速开始</h3>
                <p>了解基本操作步骤</p>
              </IonLabel>
            </IonItem>
            
            <div slot="content" className="help-content">
              <IonGrid>
                {steps.map((step, index) => (
                  <IonRow key={index}>
                    <IonCol size="12">
                      <div className="step-item">
                        <div className="step-number">
                          <IonChip color="primary">
                            <IonLabel>{index + 1}</IonLabel>
                          </IonChip>
                        </div>
                        <div className="step-content">
                          <div className="step-title">
                            <IonIcon icon={step.icon} />
                            <h4>{step.title}</h4>
                          </div>
                          <p>{step.description}</p>
                        </div>
                      </div>
                    </IonCol>
                  </IonRow>
                ))}
              </IonGrid>
            </div>
          </IonAccordion>

          <IonAccordion value="features">
            <IonItem slot="header">
              <IonIcon icon={type === 'scheduling' ? cpu : layers} slot="start" />
              <IonLabel>
                <h3>功能特性</h3>
                <p>了解所有可用功能</p>
              </IonLabel>
            </IonItem>
            
            <div slot="content" className="help-content">
              {type === 'scheduling' ? (
                <div>
                  <h4>进程调度功能</h4>
                  <ul>
                    <li><strong>多种调度算法：</strong>支持FCFS、Round Robin、Priority、SJF四种经典算法</li>
                    <li><strong>实时可视化：</strong>动态显示就绪队列、CPU状态和已完成进程</li>
                    <li><strong>甘特图：</strong>时间线展示进程执行顺序和时间分配</li>
                    <li><strong>性能统计：</strong>计算平均等待时间、周转时间、吞吐量等指标</li>
                    <li><strong>时间片设置：</strong>Round Robin算法支持自定义时间片大小</li>
                    <li><strong>进程管理：</strong>添加、删除进程，支持批量操作</li>
                  </ul>
                </div>
              ) : (
                <div>
                  <h4>内存分配功能</h4>
                  <ul>
                    <li><strong>三种分配算法：</strong>First Fit、Best Fit、Worst Fit</li>
                    <li><strong>内存可视化：</strong>直观显示内存块分配状态和大小</li>
                    <li><strong>碎片化分析：</strong>实时计算外部碎片化程度</li>
                    <li><strong>统计分析：</strong>分配成功率、内存利用率等性能指标</li>
                    <li><strong>动态管理：</strong>支持内存分配和释放操作</li>
                    <li><strong>智能建议：</strong>根据当前状态提供优化建议</li>
                  </ul>
                </div>
              )}
            </div>
          </IonAccordion>

          <IonAccordion value="tips">
            <IonItem slot="header">
              <IonIcon icon={analytics} slot="start" />
              <IonLabel>
                <h3>使用技巧</h3>
                <p>获得最佳体验的建议</p>
              </IonLabel>
            </IonItem>
            
            <div slot="content" className="help-content">
              {type === 'scheduling' ? (
                <div>
                  <h4>进程调度技巧</h4>
                  <div className="tip-section">
                    <h5>算法选择建议：</h5>
                    <ul>
                      <li>学习基础概念时，从FCFS开始</li>
                      <li>观察时间片对RR算法的影响，尝试不同的时间片大小</li>
                      <li>使用Priority算法时，注意观察饥饿现象</li>
                      <li>比较不同算法在相同进程集合下的性能差异</li>
                    </ul>
                  </div>
                  <div className="tip-section">
                    <h5>实验建议：</h5>
                    <ul>
                      <li>先加载示例数据快速体验功能</li>
                      <li>尝试创建不同到达时间和执行时间的进程组合</li>
                      <li>观察甘特图中的进程切换模式</li>
                      <li>关注统计数据中的性能指标变化</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div>
                  <h4>内存分配技巧</h4>
                  <div className="tip-section">
                    <h5>算法对比：</h5>
                    <ul>
                      <li>使用相同的分配序列测试不同算法</li>
                      <li>观察不同算法产生的碎片化程度</li>
                      <li>注意分配失败的情况和原因</li>
                      <li>比较内存利用率和分配效率</li>
                    </ul>
                  </div>
                  <div className="tip-section">
                    <h5>实验建议：</h5>
                    <ul>
                      <li>先加载示例数据了解基本操作</li>
                      <li>尝试不同大小的内存请求组合</li>
                      <li>观察内存释放后的合并效果</li>
                      <li>关注碎片化警告和性能建议</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </IonAccordion>
        </IonAccordionGroup>
      </IonCardContent>
    </IonCard>
  );
};

export default HelpGuide;
