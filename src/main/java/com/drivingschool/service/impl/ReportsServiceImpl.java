package com.drivingschool.service.impl;

import com.drivingschool.domain.Reports;
import com.drivingschool.repository.ReportsRepository;
import com.drivingschool.service.ReportsService;
import com.drivingschool.service.dto.ReportsDTO;
import com.drivingschool.service.mapper.ReportsMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.drivingschool.domain.Reports}.
 */
@Service
@Transactional
public class ReportsServiceImpl implements ReportsService {

    private final Logger log = LoggerFactory.getLogger(ReportsServiceImpl.class);

    private final ReportsRepository reportsRepository;

    private final ReportsMapper reportsMapper;

    public ReportsServiceImpl(ReportsRepository reportsRepository, ReportsMapper reportsMapper) {
        this.reportsRepository = reportsRepository;
        this.reportsMapper = reportsMapper;
    }

    @Override
    public ReportsDTO save(ReportsDTO reportsDTO) {
        log.debug("Request to save Reports : {}", reportsDTO);
        Reports reports = reportsMapper.toEntity(reportsDTO);
        reports = reportsRepository.save(reports);
        return reportsMapper.toDto(reports);
    }

    @Override
    public ReportsDTO update(ReportsDTO reportsDTO) {
        log.debug("Request to update Reports : {}", reportsDTO);
        Reports reports = reportsMapper.toEntity(reportsDTO);
        reports = reportsRepository.save(reports);
        return reportsMapper.toDto(reports);
    }

    @Override
    public Optional<ReportsDTO> partialUpdate(ReportsDTO reportsDTO) {
        log.debug("Request to partially update Reports : {}", reportsDTO);

        return reportsRepository
            .findById(reportsDTO.getId())
            .map(existingReports -> {
                reportsMapper.partialUpdate(existingReports, reportsDTO);

                return existingReports;
            })
            .map(reportsRepository::save)
            .map(reportsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ReportsDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Reports");
        return reportsRepository.findAll(pageable).map(reportsMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<ReportsDTO> findOne(Long id) {
        log.debug("Request to get Reports : {}", id);
        return reportsRepository.findById(id).map(reportsMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Reports : {}", id);
        reportsRepository.deleteById(id);
    }
}
