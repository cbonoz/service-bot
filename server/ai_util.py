from expertai.nlapi.cloud.client import ExpertAiClient
client = ExpertAiClient()



def get_normalized_terms(text):
    output = client.specific_resource_analysis(
        body={"document": {"text": text}}, 
        params={'language': 'en', 'resource': 'relevants'
    })
    term_magnitude = sum([x.score**2 for x in output.main_syncons])**.5
    if not term_magnitude:
        # No terms.
        return {}

    terms = {}
    for main_concept in output.main_syncons:
        terms[main_concept.lemma] = main_concept.score/term_magnitude

    return terms



def dot_product(first_terms, second_terms):
    score = 0
    for k in first_terms:
        if k in second_terms:
            score += first_terms[k]*second_terms[k]
    print('comparing', first_terms, second_terms, score)
    return score