const cut = require('../libs/cut');

const sentence = '任务超载的组织-哈佛商业评论\n' +
    '某公司将推出云大数据平台Analytix，负责的高管是克里斯汀。平台上线时间紧迫。两周前，团队还在按进度走，但现在却严重落后。最让克里斯汀郁闷的是，Analytix项目本身没有任何问题，但手下不断被叫到其他项目上去。三个核心工程师忙着解决另一个产品的安全漏洞，已经几天没露面了。她不得不告诉CEO没办法按时完工，可现在公司正亟需一次成功的产品发布。\n' +
    '\n' +
    '克里斯汀的遭遇并不少见。员工同时参与多个团队造成的冲突，正给越来越多企业管理者和团队领导者制造麻烦。但“多团队”工作组织方式的益处非常明显，尤其是在知识密集型行业：不同部门的多个团队可以共享一名员工的时间和智慧，并且提升工作效率。如果员工只专注于一个项目，其他时间发呆，很少有组织负担得起；一个团队也不会一直需要某一名员工100%投入精力。因此，为最大限度利用人力资本，企业像工厂使用贵重设备一样，让多个团队共享资源。这样一来，企业可以避免项目进展缓慢时的停工成本，能够雇用细分领域专家，按项目需要随时使用他们。多团队的工作组织方式，也为知识和最佳实践在组织中传播提供了重要渠道。\n' +
    '\n' +
    '虽然益处是清晰、可量化的，但成本也相当显著，必须加以控制，克里斯汀的困境就是例子。多个团队共享成员，使本来独立的项目相互影响，有可能一损俱损。除整体风险外，对团队来说，人员不断进出削弱了凝聚力和认同感，增加了建立信任和解决问题的难度。员工个体也会付出代价：分配协调投入不同项目的时间精力，让他们经常感到压力大、疲劳，甚至产生职业倦怠。\n' +
    '\n' +
    '过去15年中，我们研究了数百个团队的协作情况，涉及专业服务、油气、高科技、消费品等非常不同的领域（见边栏《关于本研究》）。我们细致观察员工在项目不同阶段的表现，对于多团队工作组织方式得到很多洞见。本文中，我们将讨论多团队工作如此普遍的原因，分析组织和团队领导者面临的关键问题，并推荐一些解决方案。\n' +
    '\n' +
    '问题紧迫\n' +
    '\n' +
    '一名员工同时参与多个项目并非新现象，而当下这种做法尤其普遍。我们对超过500名跨国企业管理者的调查显示，参与团队工作的人中，81%同时参与多个项目。其他研究得到的数字更高，例如在知识密集型行业中达到95%。\n' +
    '\n' +
    '为何多团队工作如此普遍？有几个原因。\n' +
    '\n' +
    '首先，为解决很多复杂的大问题，组织必须利用多个领域的专业知识。企业的网络安全问题涉及财务、供应链和差旅管理等不同部门。能源企业须在全球范围内协调多个大型项目，如开采深海油气田。运输和物流企业须按时将货物运送至目的地，而货物种类和运送地点多种多样。大型制造和工程项目，如飞机制造和城市基建项目，要求生产方和监管部门紧密合作。在这些情境中，组织不可能依靠全能专家制定端对端解决方案，而必须整合不同领域专家的深度知识。（关于这个话题，可参考《哈佛商业评论》2017年4月刊《让明星员工“智慧合作”》）\n' +
    '\n' +
    '其次，随着地理和行业界限不断打破，市场竞争日趋激烈，企业控制成本、拓展资源的压力增大。某专业服务公司的一位客户经理曾说：“为让客户资产真正保值增值，我们不会花钱请某位专家来工作5周，因为我们只需要他在第五周过来全力投入。”这就是为什么项目间隙的“板凳时间”、甚至慢节奏时段都越来越少见。员工只要工作量不足，组织马上给他分配任务。在研究中我们发现，即便级别较高的管理者也会在一天中兼顾7个甚至更多项目，一周之内最多可能参与25个项目。更有甚者，企业可以利用技术手段轻松掌握员工的空闲时间（即使只有几分钟），并马上让他们忙起来。\n' +
    '\n' +
    '再次，为给员工更多工作选择，改善人才培养、员工投入度和忠诚度，组织架构去层级化、去中心化趋势明显。的确，在项目制工作中，员工个体对所做工作的掌控度今非昔比，开源软件开发就是例子。这让领导团队的能力变得更为关键。（关于这个话题，可参考《哈佛商业评论》2016年6月刊《“4D团队”合作秘诀》）。同时，多团队工作方式和随之而来的风险，也上升到了全新层次。越来越多人可以自由选择短期工作，不仅在一个组织同时参与多个项目，更同时为多个组织工作。很多时候，企业在和竞争对手分享员工的时间和智慧。\n' +
    '\n' +
    '大多数管理者都能看到多团队工作的普及趋势，但很少有人能完全理解它如何影响组织、团队和员工。例如，得知谁为多团队工作付出最多时，某专业服务公司的高管十分惊讶。刚加入公司的分析师一周参与6个项目，这似乎已经很多。但随着年资增长，员工参与项目数量大幅上升，工作满6年的员工一周参与的项目多达15个。较资深的员工作为成员同时参与的项目减少，但可能负责更多项目（见图表《谁的压力最大》）。我们的访谈显示，同时在多个团队工作虽然有经验共享等益处，但压力很大——按一位受访者的说法，就是要被不同项目领导“敲打”。\n' +
    '\n' +
    '特写1-谁的压力最大\n' +
    '\n' +
    '这是一个典型的“盲人摸象”情境。管理者亲身体验到多团队工作的某些益处和弊端，但由于组织中存在多种体系和层级，他们很少能整体概观。例如，一位销售管理者希望利用团队成员从其他项目中得到的经验，为客户制定更好的解决方案。但如果团队成员同时参与5个项目，坐在一起讨论的时间都没有，这个想法就不可能实现。又如，一位项目经理手下两位工程师负荷过重，他考虑增加一名工程师帮忙，只使用对方10%的时间。但他可能没意识到，正是这种碎片化的工作方式，使得前两位工程师陷入职业倦怠的危险——他们参与了太多互相冲突的项目。这样的例子很多。\n' +
    '\n' +
    '多团队工作的益处主要与效率和知识传递相关，而成本主要涉及自我管理、人际关系和心理压力。这可能是为什么对多团队工作的成本监控和管理不足，甚至完全缺失。领导者不知不觉中，成本侵蚀了益处。\n' +
    '\n' +
    '应对挑战\n' +
    '\n' +
    '在研究和提供咨询的过程中，我们总结出团队和组织领导者降低多团队工作的成本、更好利用其益处的几种方式，下文逐一介绍。\n' +
    '\n' +
    '团队领导者的工作重点。协调员工在团队内外的工作、提升员工投入度和适应性，是团队领导者的关键挑战。在团队组建前就及早考虑这些目标，能帮助你建立紧密的团队关系、降低协作成本、减少过渡期的摩擦、防止人际冲突、发现并降低风险。以下做法可供参考：\n' +
    '\n' +
    '1. 组建团队时注重建立信任和熟悉感。只为一个团队服务时，人们会了解同事的个人生活，包括家庭、爱好和重大事件等，这让他们更好地协作。例如，大家知道谁会在孩子该睡觉时下线，谁习惯午饭时间去健身。更重要的是，这有助于紧密人际纽带和信任的形成，让团队成员能彼此提供建设性反馈、促进有价值的人际交往，并共享专业知识和技能。\n' +
    '\n' +
    '相反，在多团队工作中，员工极其注重效率，不太会分享个人信息。如果不主动为团队创造私下交流的机会，成员之间可能缺乏了解，导致各种猜疑——反应速度、对工作重视程度，等等。所以，领导者应确保团队成员一开始就有时间相互了解。这也为相距较远的同事建立信任打下基础。一位常驻波士顿的设计师对我们讲起他在英国的同事：\n' +
    '\n' +
    '“我以前觉得西尔维娅特别高冷，因为她从不参加我们的头脑风暴，而是正式写邮件，而且有时只发给项目负责人。后来我在伦敦时和她一起工作了几天，才知道她只是比较内向，表达看法需要一些时间。再者，因为她之前都没见过我们，只听得出负责人的口音，所以很难跟上电话讨论。”\n' +
    '\n' +
    '设计师回去跟负责人讲了他的“发现”，于是团队会议改用视频，这样大家都能看到西尔维娅的“思考脸”，她也不用再担心弄错谁说了什么。\n' +
    '\n' +
    '建队活动应该正式一些。团队成员应尽量在线下聚齐，如果每个人都坦诚讲讲自己的发展目标就更好。在麦肯锡公司，包括团队领导在内，每个团队成员都要告诉大家，自己期待在项目中培养或提升哪种关键技能。这种坦诚度不仅鼓励员工展示脆弱的一面（这几乎就是信任本身），也让团队成员清晰了解怎样彼此帮助。\n' +
    '\n' +
    '如果团队成员互相认识，而且每个人都准备好投入工作，开组建会似乎没必要。但研究显示，正式建队活动可以让工作效率最多提升30%，部分是因为它增强了个体间的责任感。事先明确每个人的角色和任务、建立团队规范，可以让团队成员彼此有正确的预期。当然，这在任何团队都是必要的，但在多团队工作中，员工同时属于多个团队，要适应不同角色、目标和规范，这些管理措施就尤其重要。\n' +
    '\n' +
    '如果团队人员频繁进出，你需要定期重新建队，帮助新成员尽快适应，并评估原有流程和规范是否仍然合理。一般来说，当团队15%的成员发生更替，就可以做这些工作。\n' +
    '\n' +
    '2. 评估每个人的技能。团队领导者应了解清每名成员的所有技能，既包括技术能力，也包括更宽泛的知识，如对客户决策流程的熟悉度、谈判能力、对重要目标市场的认知等。要让团队成员了解彼此带来哪些价值。这使得团队成员更有可能互相学到东西。分享知识带来的自豪感，以及互相帮助产生的凝聚力，常常和被分享的知识本身一样有价值。\n' +
    '\n' +
    '和建队活动一样，如果团队成员曾有合作经历，领导者可能会想跳过技能评估。但我们发现，即便互相熟悉的团队成员，对彼此能力的认识也可能停留在过去，并对他人的知识水平有不同观点。这可能导致团队成员对岗位安排产生分歧，或认为任务分配不公平、不合适。团队还可能去外部寻找内部本来具备的知识资源，不仅浪费时间，还会让能力被忽略的成员积极性受挫。\n' +
    '\n' +
    '谢里夫是一位税务专家，他在与4位同事合作拓展客户时就经历了这些问题。“我们觉得合作经历已经够丰富，能够了解彼此的‘甜蜜点’。”他告诉我们，“但我逐渐发现，有两位同事一直在向合作文件中添加合规建议，而这恰恰应该是我的工作，我正为另一家客户处理几乎同样的问题。这让我很郁闷。我感到自己在团队中地位下降。他们越是排挤我，我心情就越糟。”与客户见面几天前，大家终于把话说开，结果发现，谢里夫拓展专业知识的那些项目，其他人并没有参与，所以根本不知道他的优势。“我们同时做的项目涉及太多不同领域，每个人的知识技能都在快速变化。”他说，“难怪我们有摩擦。”\n' +
    '\n' +
    '技能评估能够防止这种情况发生，并降低沟通成本（如果知道谁负责某件事，写邮件时就不用再“回复全部”）。团队成员也能更好地监督彼此按时、高质量完成任务，而这在人员进出频繁的情况下很难实现。团队成员彼此充分负责，能减轻领导者日常监督的负担，让你有更多精力审视全局，预判其他团队可能对你的项目产生的影响，或沟通协调共享资源的使用权。\n' +
    '\n' +
    '3. 管理多团队时间分配。组建团队时，领导者先应明确讨论每个人的时间安排问题。如果事先确定各项目的关键时间段，你就可以调整截止期限，或在特定时间加入团队工作。把这个话题摆在桌面上，让员工无须对时间冲突感到愧疚，团队就能在问题出现时开放、有效地加以解决。\n' +
    '\n' +
    '确定适当的开会频率，有利于多团队时间管理、克服不同项目的时间冲突。项目开始时，领导者应安排好几个关键时点的全体会议。研究显示，任何项目进行到一半，都应该安排一次集体讨论，因为这时员工感到时间有限，开始加快工作节奏。要确保所有人到会，并让每个人负责主持一个环节，即使只有10分钟也可以。要提早确认每个人的时间安排，确保和其他项目不冲突。理想情况下，组织文化应重视团队讨论；如果并非如此，你可能需要在安排时间前和其他团队领导沟通。\n' +
    '\n' +
    '对于其他团队会议，只邀请有必要参加的人就可以，这样可以减少和其他项目的时间冲突。大多数情况下，你不需要所有人到场。如果可能，尽量安排小组会议。也别忘了使用技术手段。如果要更新项目进展情况，不必占用宝贵的线下时间。发一封简短的邮件，或利用在线信息平台，就可以让团队成员了解最新动态。技术工具不能替代面对面交流，但可以在没时间开全体会时解决沟通问题。你还可以尝试创新：年轻员工可能更愿意看一段30秒的视频，而不是读一份两页的备忘录。和团队成员通过Skype或FaceTime简短随意的交流，能让你了解他们其他项目的截止时间。视频也能帮助你了解团队成员的积极性和紧张度。\n' +
    '\n' +
    '4. 创造学习环境。学习让工作显得更有意义，而且也本应是多团队工作的一项主要优势，但经常受时间压力所累。此外也有其他障碍：即便你努力构建信任和人际纽带，同时参与多个项目的员工也很难像专注一个项目的员工一样，给出有效反馈。把时间分配给几个项目的员工，很难经常观察同组员工的行为，或找不到合适的时间来提出建设性反馈。如果员工只看到项目的一小部分，就弄不明白什么样的反馈是适当的。他们更加专注于短期任务，只在必要时才和同事沟通。\n' +
    '\n' +
    '嘉莉在某大城市一家主要医院工作，被提拔为拓展部门负责人，她手下的20名员工每周参与的项目多达数十个。6个月后，嘉莉意识到：“我们之间完全没有反馈。过去半年里，尽管有些项目明显未能达到预期，可关于如何改进工作，我没有听到一个建议。”为改变局面，她带头寻求反馈并积极回应。“我每天坚持这样做，开始创造出一种气氛，让人们在需要帮助时及时说出自己的问题。”她说，“一段时间后，我觉得可以建立更正式的项目评估流程，让每个人都能吸取教训，而不必担心受到责备或惩罚。”\n' +
    '\n' +
    '领导者还可指定来自其他部门或分公司的员工共同领导项目，让他们从更大范围的交流中受益。正式的指派让员工更有动力投入时间向同伴学习。类似，可以让一位经验丰富的团队成员与资历较浅的员工搭档，并让他们知道彼此都能从交流中受益，而不是单向的传授。\n' +
    '\n' +
    '当来自不同背景的团队成员可能带来新洞见，领导者应多问“如果……会怎样”，激发探究精神。面对问题，如果你知道某个团队成员拥有相关经验，可以更全面地回答，不妨请他专门给提问者做一些讲解。\n' +
    '\n' +
    '5. 提升团队积极性。在传统的固定团队中，强大的凝聚力和认同感能够激励团队成员。但在多团队工作环境中，领导者须学会与员工建立互惠关系。当团队成员只在某个项目上投入一小部分时间，参与的热情自然会减退。他们会想：“如果只有10%的成果归功于我，那我该投入多少时间精力呢？”领导者应弄清这些“10%分子”最看重什么，并据此安排工作。例如，你手下有一位千禧一代员工很想培养通用技能，你就可以在开会时让团队成员分享新知，或在项目结束时组织内部培训活动，让员工互相传授技能。\n' +
    '\n' +
    '同时要记住，公平感能影响很多行为。\n' +
    '\n' +
    '特写1-多团队工作的目标\n' +
    '\n' +
    '如果员工感觉在他出力时有人却在偷懒，就会很快变得消极。团队成员多线程工作时，通常很难让大家认识到彼此的投入。作为领导者，你应该坚持公开说明团队成员的贡献，让整个团队都能看到，从而清楚意识到集体的努力。\n' +
    '\n' +
    '像那位身处困境的软件开发负责人克里斯汀一样，你可能会感受到和其他团队分享宝贵人才带来的限制。当觉得难以忍受时，你可以采取措施，确认并调整与其他团队的关系。这会帮助你避免冲突，或至少缓和冲突，并树立积极与其他团队领导者协作的形象——毕竟他们也和你面临相同的挑战。\n' +
    '\n' +
    '组织领导者的工作重点。如果在你领导的组织，多团队工作非常普遍，你就须仔细留意有多少员工以何种方式在多个团队同时工作。我们发现，以下做法可以帮助组织领导者降低风险、推动创新。\n' +
    '\n' +
    '1. 评估和分析人力资本相互依赖度。多团队共享人才的方式，从高度集中（几个团队分享很多员工）到高度分散（员工散布在多个团队）都有。\n' +
    '\n' +
    '每种方式都会给组织管理带来特定的风险。当某个团队遭遇意外情况，急需全员到位，如果员工分布较为集中，那么他们离开的团队就会受到很大影响。如果员工分布较为分散，那么受影响的团队会比较多，但影响程度较低（见图表《哪些团队受到打击？》）。\n' +
    '\n' +
    '特写1-哪些团队受到打击？\n' +
    '\n' +
    '员工分布方式也会影响知识传递。各团队成员分享有效工作方式并总结教训，使最佳实践在不同项目间传播。高度集中的员工分布让团队间的理念传播更容易，高度分散的员工分布则能把理念带到更多团队。\n' +
    '\n' +
    '领导者应定期了解团队管理者和员工动态，密切关注组织中各团队的联系。这类沟通的频率取决于团队的生命周期。如果团队和任务每周都在变，就应当经常沟通；如果是一年以上的长期项目且团队成员稳定，则无须频繁沟通。这种全局视角能让你看到哪些团队因为孤立而未能跟上趋势，或因为联系太紧密而面临成员分布过于集中的风险。\n' +
    '\n' +
    '对于团队相互依赖度，我们最常被问的问题是，“最合适的比例是什么”。很遗憾，无论是团队成员分布方式，还是每名员工参与的团队数量，都没有最佳答案。对于这两个问题，具体情境都是最重要的。如果多个团队的任务和文化非常相似，转换团队就相对容易，员工分布可以更集中，每个人也可以参与更多团队。但对于任务和文化非常不同的团队，要尽可能减少转换，因为要求更多、成本更高。有意思的是，如果各团队工作量不同，员工也可以参与更多团队，因为他们不会同时被所有团队急需，不会像出年报前的税务顾问一样容易职业疲劳。\n' +
    '\n' +
    '做完所有这些分析后，你就可以着手解决发现的问题——详见下面两个步骤。\n' +
    '\n' +
    '2. 促进知识传播。无论是有意为之还是巧合，如果有的团队很少或没有员工参与其他团队，领导者都应特别留意。你应该帮助这些“孤岛”团队了解其他团队的成功经验、分享自身的知识和理念，并更合理地使用内部资源。\n' +
    '\n' +
    '领导者的目标应该是将知识传递确立为一种文化规范，让员工知道，当他们花时间去分享来自不同项目的洞见时，每个人都会受益。像推动任何文化转变一样，领导者必须以身作则，并奖励跟着做的人。这说起来容易做起来难，因此你需要强调分享的益处，并设置流程、提供技术手段，如“午餐研讨会”、在线论坛等，为分享创造条件。我们合作过的一家科技公司会特别表彰由最佳实践传播带来的突破性进展。在一家制造企业的研发部门，员工每月分享在多团队工作中得到的新洞见。两家公司这样做的目的，都是让知识传播的益处清晰可见，对抗让员工低头忙眼前工作的不断增强的压力。\n' +
    '\n' +
    '3. 防范意外事件。如何防止一个团队发生的意外情况传导到其他团队？很多时候这难以做到。不过，了解清楚共享员工的团队之间的联系，能让你预判意外事件传导的方向，并在系统中少量置入冗余以减少负面影响。这并不是说让一些员工什么也不做，只为等待紧急状况；你需要让员工在必要时能够转移注意力。我们合作过的一家工程企业指定几个能力较强的“救火队员”，安排他们参与长期项目，临时去处理紧急情况也不会有影响。这些员工乐于暂时离开日常工作去处理有挑战性的问题，也算是额外收获。\n' +
    '\n' +
    '判断哪些项目可以中断，哪些不能，这需要批判性眼光和明确的战略优先次序。有些情况下，有必要给予某些项目受保护的特权，让其成员无须回应其他团队的紧急求救。总体原则是，积极处理当下出现的问题，同时保证满足团队的基本需求。当然，即便置入一定冗余，有时也需要投入额外资源拯救重要项目。但如果有预防措施，其他团队受影响会小一些。\n' +
    '\n' +
    '以上这些工作都不容易。为精确追踪企业内部的多团队组织方式，你可能需要与HR或IT部门合作建立流程或系统，甚至需要设立一个新职位来有效定义和协调这些任务。此外，对团队增强监督可能引发抗拒。习惯更自由工作方式的团队领导者和员工都可能感觉管理过度，在创业文化中就更如此。但这些投入最终是值得的。完全不考虑多团队工作的利弊，疏于管理，组织的成本将会更高。如果你能坦诚指出想解决的问题，员工就不太会感到被监视或限制，而更可能看到积极的方面。\n' +
    '\n' +
    '今天，几乎每个知识工作者都同时参与多个团队或项目。组织和团队领导者可以共同创造适当的环境，最大限度利用这个趋势。为此，你需要管理多个团队相互依存带来的风险、明确并协调项目之间的冲突，并消除团队战略协同的障碍。你还需要设法在合作时间很有限的员工之间建立纽带和信任。\n' +
    '\n' +
    '总体来说，这项工作需要投入大量时间和努力。但如果盲目追求多团队工作的效益却忽视其成本，组织将付出更高代价。（（王晨 | 译   蒋荟蓉 | 校   李全伟 | 编辑））\n' +
    '\n' +
    '马克·莫滕森是英士国际商学院组织行为学科副教授、主任。他的研究、教学和咨询工作涉及协作、组织架构设计、创新思考和领导力。海迪·加德纳是哈佛大学法学院荣誉研究员，著有《智慧合作》（Smart Collaboration: How Professionals and Their Firms Succeed byBreaking Down Silos，《哈佛商业评论》出版社，2017）。她的研究、教学和咨询工作主要集中于专业服务公司的管理和协作。';
const commonDic = require('../dicts/common.dict.json');

const regChi = new RegExp('([\u4E00-\u9FD5a-zA-Z+#&\\._]+)');
function TFIDF(words) {
    words = words.filter(w => w.length > 1 && regChi.test(w));
    const total = words.length;
    const freq = {};
    words.forEach((w) => {
        if (freq.hasOwnProperty(w)) {
            freq[w].fq += 1;
        } else {
            freq[w] = {
                w: w,
                fq: 1
            };
        }
    });
    const retArr = [];
    for (const w in freq) {
        if (freq.hasOwnProperty(w)) {
            freq[w].tf = freq[w].fq / total;
            if (commonDic.dic.hasOwnProperty(w)) {
                freq[w].idf = Math.log(commonDic.total / commonDic.dic[w]);
            } else {
                freq[w].idf = 0.1;
            }
            freq[w].score = freq[w].tf * freq[w].idf;
            retArr.push(freq[w]);
        }
    }
    retArr.sort((a, b) => (a.score > b.score ? -1 : 1));
    return retArr.slice(0, 9);
}

const cuts = cut.cut(sentence, false, false);
console.log(TFIDF(cuts));
