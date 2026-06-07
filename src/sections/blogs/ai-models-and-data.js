export default {
    id: 'ai-models-and-data',
    title: 'AI Models & Data',
    category: 'TryHackMe',
    difficulty: 'Medium',
    tags: ['AI', 'ML', 'Cybersecurity'],
    date: '2026-04-22T12:00:00',
    excerpt: 'Write up and walkthrough of AI Models & Data room on TryHackMe.',
    content: `
This is a write up and walkthrough of the AI Models & Data room on TryHackMe.

⸻⸻⸻⸻⸻

[dropdown-tabs:Task 1 Introduction]
Every AI model is, at its core, a product of its training data. Before a single prediction is made or a single prompt is answered, decisions about what data to collect, where to collect it from, and how to process it have already shaped everything the model will ever do. Those decisions carry security implications that most organisations deploying AI today have never examined. From PII scraped from the open web to credentials baked into model weights to safety mechanisms quietly eroded during fine-tuning, the risks don't begin when a model is deployed. They begin long before, in a data supply chain that is often invisible, poorly documented, and almost entirely unaudited.

###Learning Objectives
- Understand where AI training data comes from and the security risks introduced by poor data provenance
- Recognise how PII and sensitive credentials can become permanently embedded in model weights through large-scale web scraping
- Understand how key model-building decisions (overfitting, quantisation, and federated learning) each introduce distinct security risks
- Understand the inheritance problem and what organisations unknowingly take on when fine-tuning pre-trained models
- Recognise why trained models are opaque black boxes, and what model cards do (and fail to do) to address this

###Prerequisites
The basics of AI/ML should be understood, as covered in our <a href="https://tryhackme.com/room/aimlsecuritythreats">AI/ML Security Threats</a> room.
[/dropdown-tabs]
⸻⸻⸻⸻⸻

[dropdown-tabs:Task 2 Training Data]
In the <a href="https://tryhackme.com/room/aimlsecuritythreats">AI/ML Security Threats</a> room, we walked through the machine learning lifecycle and established that before a model can be trained, data must be collected and cleaned. That sounds orderly enough. But let's slow down a tad and ask the questions that the lifecycle diagram doesn't answer: collected from where, and cleaned by whom? As you'll see, the answers carry significant security implications, and most organisations deploying AI today have no idea what they are.

###Where Does the Data Come From?
Training a large language model requires a staggering amount of text. GPT-3 was trained on roughly 570GB of filtered text, and that's considered relatively modest by "modern" standards. To hit numbers like that, developers can't carefully hand-pick sources. The pipeline typically draws from four buckets:
[table]
Source | What it is | Trust profile
Web scraping | Automated crawls of public internet content (news, forums, blogs, social media, etc.) | Low: no curator, no version control, content changes after collection
Licensed datasets | Data purchased or agreed with platforms (e.g., OpenAI + Reddit, Meta's own social posts) | Medium: terms often unclear; original users rarely consented to AI training use
Synthetic data | AI-generated content used to train further AI systems | Variable: growing fast; ~12% of fine-tuning datasets now contain LLM-generated content
Internal corpora | Company knowledge bases, support transcripts, clinical notes used for fine-tuning | Higher: organisation has direct control, but also direct liability if mishandled
[/table]

The most widely used training dataset is <a href="https://commoncrawl.org/">Common Crawl</a>, a free, publicly available archive of web crawl data that has underpinned essentially every major model family. DeepSeek-V2 was pretrained on it; DeepSeek-V3 trained on 14.8 trillion tokens with Common Crawl as a core source; and LLaMA 4 was scaled to 40 trillion tokens across 200 languages using a similar pipeline. GPT-3 is one of the few models whose breakdown is publicly documented: 60% of its tokens came from a filtered version of Common Crawl, and more recent models lean even more heavily on it. The keyword is "filtered", and how that filtering was done, by whom, and what slipped through is where the security story begins.

###The Problem of Provenance
Data provenance is the ability to answer three questions about any piece of training data:
    1. Where did it come from?
    2. When was it collected?
    3. Has it been modified since?
In most AI supply chains today, the honest answer to all three is we don't fully know. Most major models are essentially trained on datasets of datasets, huge composites assembled from hundreds of upstream sources, where the original attribution has been lost, simplified, or never recorded in the first place. The <a href="https://www.dataprovenance.org/">Data Provenance Initiative</a> audited over 1,800 datasets and found that more than 70% of licenses on popular hosting platforms were listed as "Unspecified", and of those that were labelled, 66% were miscategorised, usually listed as more permissive than they actually were. Organisations fine-tuning on these datasets often don't know what they legally have, let alone what's actually inside it.

The software security world has been here before. SolarWinds taught the industry that you can't trust a compiled binary if you don't know what went into it, which is exactly why software bills of materials (SBOMs) became standard practice. The AI equivalent is the ML-BOM: a documented inventory of dataset sources, licenses, PII categories, and filtering decisions. Adoption is still early, and most organisations deploying third-party models today have nothing close to one.

###PII in the Pipeline
One of the most direct consequences of undocumented, large-scale web scraping is that personally identifiable information ends up baked into model weights. Once it's there, it's very difficult to remove. Medical records, personal email threads, forum posts about health conditions or political views: all of it gets swept up if it was publicly accessible at crawl time. The EU's GDPR explicitly requires data minimisation (collect only what's necessary). This sits in direct tension with the "more data is always better" logic driving pre-training.

The security implication is measurable and concrete. <a href="https://trufflesecurity.com/blog/research-finds-12-000-live-api-keys-and-passwords-in-deepseek-s-training-data">Truffle Security</a> scanned the December 2024 Common Crawl archive (400TB of data from 2.67 billion web pages) and found nearly 12,000 live, verified API keys and passwords. With the right prompt, a model trained on that data can sometimes be coaxed into surfacing training content near-verbatim, including credentials. This isn't a bug introduced by an attacker. It's a consequence of what went in during training, and no patch fixes it once the model is deployed.

###A Model Engineer
A model's behaviour is a direct product of what it was trained on. If that data was scraped without audit, contaminated with PII, or manipulated upstream, those characteristics become part of the model, and there's no reliable way for the organisation deploying it to know. The data supply chain is as real and as exploitable as a software supply chain. For organisations right now, it's almost entirely invisible.

**Answer the questions below**⸻⸻⸻⸻⸻

What term describes the ability to answer where data came from, when it was collected, and whether it has been modified?
**Answer:** Data Provenance

What is the name of the most widely used public corpus that underpins essentially every major model family?
**Answer:** Common Crawl

What is the AI equivalent of a Software Bill of Materials (SBOM), used to document dataset sources, licenses, and filtering decisions?
**Answer:** ML-BOM
[/dropdown-tabs]
⸻⸻⸻⸻⸻

[dropdown-tabs:Task 3 Building the Model]
###Building the Model: Key Concepts
When we covered the ML lifecycle in <a href="https://tryhackme.com/room/aimlsecuritythreats">AI/ML Security Threats</a>, we did so at a high level: data in, model out. This task zooms into some of the decisions made along the way that have yet to be covered. Each concept below establishes a foundation for future security topics, so the goal here is not just to define them but to understand why they matter from a security perspective.

###Epochs and Overfitting
An **epoch** is one complete pass of the training algorithm through the entire dataset. In practice, models are trained over many epochs. The algorithm repeatedly sees the same data, adjusting its parameters each time until it converges on accurate predictions.

The catch is that more epochs don't always mean a better model. Train for too long and the model stops learning general patterns and starts memorising training data specifically, a problem called **overfitting**. An overfit model performs well on its training data but poorly on other data. This matters for security because overfitting is one mechanism by which a model can "memorise" specific details from its training data, including sensitive ones, making it more likely to reproduce them when prompted.

###Model Validation
To catch overfitting early, a portion of the training data is held back and never used for training; this is the validation set. At regular intervals during training, the model is tested on unseen data to check whether its performance is actually generalising or just improving on the training examples it's seen before. If training accuracy keeps climbing but validation accuracy plateaus or drops, that's overfitting in real time.

From a security perspective, validation is the quality gate in the ML lifecycle. A model that skips thorough validation is one whose real-world behaviour is unknown, and such unknown behaviour is a security risk. It also means any biases or anomalies introduced through compromised training data may go undetected until the model is already deployed.

###Post-Training Optimisation: Pruning and Quantisation
Once a model is trained, it often goes through compression steps before deployment (particularly if it needs to run efficiently on limited hardware). Two of the most common are **pruning** and **quantisation**:
[table]
Technique | What it does | Security consideration
Pruning | Removes parameters that contribute little to predictions, shrinking model size | Changes model behaviour post-training; rarely documented in detail
Quantisation | Reduces numerical precision of weights (e.g., 32-bit to 8-bit floats) to cut memory and compute requirements | Can degrade safety-aligned behaviour; backdoor defences tested on full-precision models may fail to detect threats in quantised versions
[/table]

Both steps are applied after the training is complete, often by a different third-party team packaging the model for distribution. Research has shown that quantisation can silently degrade the safety mechanisms built into a model; defences that worked on the full-precision version may fail to detect backdoors once the model is compressed. When an organisation downloads a quantised model without documentation of what changed during compression, they're inheriting unknown behaviour modifications alongside efficiency gains.

###Federated Learning
All the training approaches covered so far assume that data flows into a single central location for model training. **Federated learning** flips this: the model is trained across many decentralised devices or organisations, with each participant training locally on their own data and only sending weight updates (not the raw data itself) back to a central server for aggregation.

This was designed with privacy in mind. A hospital sharing patient records to train a model is a data protection problem; a hospital contributing model updates without ever sending the records is a much easier conversation. In that sense, federated learning genuinely does reduce privacy risk at the data level.

The security trade-off, however, is that the integrity of the training process becomes much harder to verify. In a centralised setup, the organisation that trains the model controls the data. In a federated setup, participants can submit poisoned local updates (subtly manipulated gradients designed to skew the global model's behaviour), and these can be very difficult to detect at the aggregation stage. The question shifts from "who controls the data?" to "who controls the aggregation, and can any participant corrupt it?"

Federated learning is therefore an interesting case study in security trade-offs: it solves one trust problem by distributing control, but in doing so creates a different one.

**Answer the questions below*⸻⸻⸻⸻⸻

What term describes one complete pass of the training algorithm through the entire dataset?
**Answer:** Epoch

What problem occurs when a model memorises training data rather than learning general patterns?
**Answer:** Overfitting

What post-training optimisation technique reduces the numerical precision of model weights to cut memory and compute requirements?
**Answer:** Quantisation

What training approach trains a model across decentralised devices, sending only weight updates rather than raw data to a central server?
**Answer:** Federated Learning
[/dropdown-tabs]
⸻⸻⸻⸻⸻

[dropdown-tabs:Task 4 The Inheritance Problem]
[/dropdown-tabs]
⸻⸻⸻⸻⸻

[dropdown-tabs:Task 5 The Black Box Problem]
[/dropdown-tabs]
⸻⸻⸻⸻⸻

[dropdown-tabs:Task 6 Practical]
[/dropdown-tabs]
`
}